import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function to add watermark to processed images for free users
async function addWatermark(imageBlob: Blob): Promise<Blob> {
  const canvas = new OffscreenCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Create image from blob
  const imageBitmap = await createImageBitmap(imageBlob);
  
  // Set canvas size to image size
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  
  // Draw the original image
  ctx.drawImage(imageBitmap, 0, 0);
  
  // Add watermark
  const fontSize = Math.max(16, Math.min(imageBitmap.width, imageBitmap.height) / 20);
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  
  const watermarkText = 'PicPerf.com';
  const textMetrics = ctx.measureText(watermarkText);
  const x = canvas.width - textMetrics.width - 20;
  const y = canvas.height - 20;
  
  // Draw watermark with stroke for better visibility
  ctx.strokeText(watermarkText, x, y);
  ctx.fillText(watermarkText, x, y);
  
  // Convert canvas back to blob
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return blob;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let jobId: string;
  
  try {
    const requestBody = await req.json();
    jobId = requestBody.jobId;
    
    if (!jobId) {
      throw new Error("Job ID is required");
    }

    console.log("Processing job:", jobId);

    // Get API key from environment
    const removeBgApiKey = Deno.env.get("REMOVE_BG_API_KEY");
    if (!removeBgApiKey) {
      throw new Error("Remove.bg API key not configured");
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get job details
    const { data: job, error: jobError } = await supabaseAdmin
      .from('image_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error(`Job not found: ${jobError?.message}`);
    }

    console.log("Found job:", job.original_file_path);

    // Update job status to processing
    await supabaseAdmin
      .from('image_jobs')
      .update({ status: 'processing' })
      .eq('id', jobId);

    // Get the original image from storage
    const { data: imageData, error: downloadError } = await supabaseAdmin.storage
      .from('originals')
      .download(job.original_file_path);

    if (downloadError || !imageData) {
      throw new Error(`Failed to download original image: ${downloadError?.message}`);
    }

    console.log("Downloaded original image, size:", imageData.size);

    // Call remove.bg API
    const formData = new FormData();
    formData.append('image_file', imageData, 'image.jpg');
    formData.append('size', 'auto');

    console.log("Calling remove.bg API...");
    
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': removeBgApiKey,
      },
      body: formData,
    });

    if (!removeBgResponse.ok) {
      const errorText = await removeBgResponse.text();
      throw new Error(`Remove.bg API error: ${removeBgResponse.status} - ${errorText}`);
    }

    let processedImageBlob = await removeBgResponse.blob();
    console.log("Received processed image from remove.bg, size:", processedImageBlob.size);

    // Get user's subscription tier to determine if watermark is needed
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier')
      .eq('id', job.user_id)
      .single();

    // Add watermark for free users
    if (userProfile?.subscription_tier === 'free') {
      console.log("Adding watermark for free user");
      processedImageBlob = await addWatermark(processedImageBlob);
    }

    // Upload processed image to storage
    const processedFileName = `${job.user_id}/${Date.now()}_no_bg.png`;
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('processed')
      .upload(processedFileName, processedImageBlob, {
        contentType: 'image/png'
      });

    if (uploadError) {
      throw new Error(`Failed to upload processed image: ${uploadError.message}`);
    }

    console.log("Uploaded processed image:", processedFileName);

    // Get current user's profile to increment processed count
    const { data: currentProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('images_processed')
      .eq('id', job.user_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    // Update user's processed image count
    const newCount = (currentProfile?.images_processed || 0) + 1;
    await supabaseAdmin
      .from('profiles')
      .update({ images_processed: newCount })
      .eq('id', job.user_id);

    // Update job with completion status
    await supabaseAdmin
      .from('image_jobs')
      .update({ 
        status: 'completed',
        processed_file_path: processedFileName
      })
      .eq('id', jobId);

    console.log("Job completed successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed_file_path: processedFileName,
        images_processed: newCount
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Processing error:', error);
    
    // Update job with error status if jobId exists
    if (jobId) {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
          { auth: { persistSession: false } }
        );
        
        await supabaseAdmin
          .from('image_jobs')
          .update({ 
            status: 'failed',
            error_message: error.message
          })
          .eq('id', jobId);
      } catch (updateError) {
        console.error('Failed to update job with error status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});