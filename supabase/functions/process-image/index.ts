import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId } = await req.json();
    
    if (!jobId) {
      throw new Error("Job ID is required");
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
      throw new Error("Job not found");
    }

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
      throw new Error("Failed to download original image");
    }

    // Convert image to blob for processing
    const imageBlob = imageData;
    
    // For now, we'll simulate processing by copying the original
    // In a real implementation, you would call an AI service like remove.bg here
    const processedFileName = `${job.user_id}/${Date.now()}_processed.png`;
    
    // Upload processed image (for demo, we're just uploading the original)
    const { error: uploadError } = await supabaseAdmin.storage
      .from('processed')
      .upload(processedFileName, imageBlob, {
        contentType: 'image/png'
      });

    if (uploadError) {
      throw new Error("Failed to upload processed image");
    }

    // Update job with completion status
    await supabaseAdmin
      .from('image_jobs')
      .update({ 
        status: 'completed',
        processed_file_path: processedFileName
      })
      .eq('id', jobId);

    // Update user's processed image count
    await supabaseAdmin
      .from('profiles')
      .update({ 
        images_processed: supabaseAdmin.sql`images_processed + 1`
      })
      .eq('id', job.user_id);

    return new Response(
      JSON.stringify({ success: true, processed_file_path: processedFileName }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Processing error:', error);
    
    // Update job with error status if jobId exists
    if (req.json && (await req.json()).jobId) {
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
        .eq('id', (await req.json()).jobId);
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