import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

const DocumentUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    priority: 1,
    file: null as File | null,
  });

  const departments = [
    'Engineering',
    'Operations', 
    'HR',
    'Compliance',
    'Procurement',
    'Safety'
  ];

  const priorityLabels = {
    1: { label: 'Low', color: 'bg-green-500' },
    2: { label: 'Medium', color: 'bg-yellow-500' },
    3: { label: 'High', color: 'bg-orange-500' },
    4: { label: 'Urgent', color: 'bg-red-500' },
    5: { label: 'Critical', color: 'bg-red-700' },
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.file) return;

    setUploading(true);
    
    try {
      // Upload file to Supabase Storage (we'll create this bucket)
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // For now, we'll just store the document metadata without actual file upload
      // In production, you'd upload to Supabase Storage first
      
      const { error } = await supabase.from('documents').insert({
        title: formData.title,
        description: formData.description,
        file_path: fileName,
        file_type: formData.file.type,
        department: formData.department,
        priority: formData.priority,
        uploaded_by: user.id,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: 'Document uploaded successfully',
        description: `${formData.title} has been submitted for processing`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        department: '',
        priority: 1,
        file: null,
      });

      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-elegant">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Upload Document
            </h1>
            <p className="text-muted-foreground">
              Submit documents for processing and approval
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter document title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the document content and purpose"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select 
                  value={formData.priority.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([value, { label, color }]) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.mp3,.mp4"
                  className="hidden"
                  required
                />
                <Label 
                  htmlFor="file-upload" 
                  className="cursor-pointer text-primary hover:text-primary/80 font-medium"
                >
                  Click to upload or drag and drop
                </Label>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports: PDF, DOC, DOCX, PNG, JPG, WEBP, MP3, MP4 (Max 20MB)
                </p>
                {formData.file && (
                  <div className="mt-4 p-3 bg-accent/20 rounded-lg border border-border/30">
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{formData.file.name}</span>
                      <Badge variant="secondary">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {formData.priority > 3 && (
              <div className="flex items-center gap-2 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  High priority documents will be flagged for immediate manager attention
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base" 
              variant="hero"
              disabled={uploading || !formData.file || !formData.title || !formData.department}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DocumentUpload;