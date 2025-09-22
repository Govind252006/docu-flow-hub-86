import { createWorker } from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface OCRResult {
  text: string;
  confidence: number;
}

export class OCRService {
  private static tesseractWorker: Tesseract.Worker | null = null;

  // Initialize Tesseract worker (lazy loading)
  private static async initializeTesseract(): Promise<Tesseract.Worker> {
    if (!this.tesseractWorker) {
      console.log('Initializing Tesseract OCR worker...');
      this.tesseractWorker = await createWorker('eng');
      console.log('Tesseract worker initialized');
    }
    return this.tesseractWorker;
  }

  // Extract text from image files using Tesseract.js
  static async extractTextFromImage(file: File): Promise<OCRResult> {
    try {
      console.log('Starting image OCR extraction...');
      const worker = await this.initializeTesseract();
      
      const { data: { text, confidence } } = await worker.recognize(file);
      
      console.log('Image OCR completed with confidence:', confidence);
      return {
        text: text.trim(),
        confidence: confidence
      };
    } catch (error) {
      console.error('Error extracting text from image:', error);
      throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Extract text from PDF files using PDF.js
  static async extractTextFromPDF(file: File): Promise<OCRResult> {
    try {
      console.log('Starting PDF text extraction...');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const totalPages = pdf.numPages;
      
      console.log(`Processing PDF with ${totalPages} pages...`);
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n\n';
        console.log(`Extracted text from page ${pageNum}/${totalPages}`);
      }

      return {
        text: fullText.trim(),
        confidence: 100 // PDF text extraction is generally 100% accurate
      };
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error(`PDF text extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Main method to extract text from any supported file type
  static async extractText(file: File): Promise<OCRResult> {
    const fileType = file.type.toLowerCase();
    
    console.log(`Processing file: ${file.name} (${fileType})`);
    
    if (fileType === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (fileType.startsWith('image/')) {
      return this.extractTextFromImage(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}. Only PDF and image files are supported for OCR.`);
    }
  }

  // Clean up resources
  static async cleanup(): Promise<void> {
    if (this.tesseractWorker) {
      console.log('Terminating Tesseract worker...');
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
    }
  }
}

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    OCRService.cleanup();
  });
}