import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, Loader2, Download, Trash2 } from 'lucide-react';

interface ImageJob {
  id: string;
  original_file_path: string;
  processed_file_path: string | null;
  status: string;
  job_type: string;
  error_message: string | null;
  created_at: string;
}

const ImageProcessor = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [jobs, setJobs] = useState<ImageJob[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('image_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data || []);
    }
  }, [user]);

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFileUpload = async (file: File) => {
    if (!user || !profile) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images.",
        variant: "destructive"
      });
      return;
    }

    if (profile.images_processed >= profile.usage_limit) {
      toast({
        title: "Usage limit reached",
        description: "Upgrade your plan to process more images.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('originals')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create job record
      const { error: jobError } = await supabase
        .from('image_jobs')
        .insert({
          user_id: user.id,
          original_file_path: fileName,
          job_type: 'background_removal',
          status: 'pending'
        });

      if (jobError) throw jobError;

      toast({
        title: "Image uploaded successfully",
        description: "Your image is ready for processing."
      });

      fetchJobs();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const processImage = async (jobId: string) => {
    setProcessing(true);

    try {
      const { error } = await supabase.functions.invoke('process-image', {
        body: { jobId }
      });

      if (error) throw error;

      toast({
        title: "Processing started",
        description: "Your image is being processed. This may take a few moments."
      });

      // Poll for updates
      const pollInterval = setInterval(async () => {
        const { data } = await supabase
          .from('image_jobs')
          .select('status')
          .eq('id', jobId)
          .single();

        if (data?.status === 'completed' || data?.status === 'failed') {
          clearInterval(pollInterval);
          fetchJobs();
          refreshProfile();
          
          if (data.status === 'completed') {
            toast({
              title: "Processing complete",
              description: "Your image has been processed successfully!"
            });
          } else {
            toast({
              title: "Processing failed",
              description: "There was an error processing your image.",
              variant: "destructive"
            });
          }
        }
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('processed')
      .download(filePath);

    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'processed-image';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const deleteJob = async (jobId: string, originalPath: string, processedPath?: string) => {
    try {
      // Delete files from storage
      await supabase.storage.from('originals').remove([originalPath]);
      if (processedPath) {
        await supabase.storage.from('processed').remove([processedPath]);
      }

      // Delete job record
      await supabase.from('image_jobs').delete().eq('id', jobId);

      toast({
        title: "Image deleted",
        description: "The image and its processing job have been removed."
      });

      fetchJobs();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Sign in to process images</h3>
        <p className="text-muted-foreground">Create an account to start removing backgrounds with AI.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Upload an image to remove its background with AI. {profile && (
              <span className="text-primary font-medium">
                {profile.images_processed}/{profile.usage_limit} images used this month
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {dragActive ? 'Drop your image here' : 'Upload your image'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop or click to select. Max file size: 10MB
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Select Image'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {jobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Images</CardTitle>
            <CardDescription>
              Track the status of your image processing jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {job.original_file_path.split('/').pop()}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Status: {job.status}
                        {job.status === 'processing' && (
                          <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />
                        )}
                      </p>
                      {job.error_message && (
                        <p className="text-sm text-destructive">{job.error_message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {job.status === 'pending' && (
                      <Button
                        onClick={() => processImage(job.id)}
                        disabled={processing}
                        size="sm"
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Process'
                        )}
                      </Button>
                    )}
                    {job.status === 'completed' && job.processed_file_path && (
                      <Button
                        onClick={() => downloadImage(job.processed_file_path!)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteJob(job.id, job.original_file_path, job.processed_file_path || undefined)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Progress */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Your Plan & Usage</CardTitle>
            <CardDescription>
              {profile.subscription_tier === 'free' ? 'Free plan' : 
               profile.subscription_tier === 'pro' ? 'Pro plan' : 
               profile.subscription_tier === 'unlimited' ? 'Unlimited plan' : 
               `${profile.subscription_tier} plan`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Images processed this month</span>
                  <span>
                    {profile.images_processed}/
                    {profile.usage_limit === 999999 ? '∞' : profile.usage_limit}
                  </span>
                </div>
                <Progress 
                  value={profile.usage_limit === 999999 
                    ? 0 
                    : (profile.images_processed / profile.usage_limit) * 100} 
                  className="h-2"
                />
              </div>
              
              {profile.subscription_tier === 'free' && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm">Upgrade for more features:</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Remove watermarks from exports</li>
                    <li>• HD quality downloads</li>
                    <li>• Access to premium backgrounds</li>
                    <li>• Priority support</li>
                  </ul>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    View Plans
                  </Button>
                </div>
              )}
              
              {profile.images_processed >= profile.usage_limit && profile.subscription_tier !== 'unlimited' && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm text-destructive">Usage limit reached</h4>
                  <p className="text-xs text-muted-foreground">
                    You've processed all {profile.usage_limit} images for this month. 
                    Upgrade your plan to continue processing images.
                  </p>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Upgrade Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageProcessor;