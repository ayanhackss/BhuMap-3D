"use client";
import { useState } from "react";
import { Upload, FileType, CheckCircle, Cpu, File, AlertTriangle, ArrowRight, Save, Map } from "lucide-react";
import Link from "next/link";

const STEPS = [
  "Select Type", "Upload", "Metadata", "CRS", "Preview", "Validate", "Process", "Publish"
];

export default function DatasetUploadWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(c => c + 1);
      if (currentStep === 5) { // Entering "Process"
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep(7); // Jump to publish
        }, 3000);
      }
    }
  };

  return (
    <div className="p-6 h-full overflow-auto max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
          <Upload className="w-6 h-6 text-[var(--color-accent)]" />
          Data Import Wizard
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
          Ingest GIS, Point Cloud, and BIM datasets into the 3D-BhuMap system.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--color-ink)] -translate-y-1/2 rounded" />
        <div className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 rounded transition-all" 
             style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
        <div className="flex justify-between relative z-10">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                ${idx < currentStep ? "bg-blue-600 text-[var(--color-ink)]" : idx === currentStep ? "bg-blue-500 ring-4 ring-blue-500/20 text-[var(--color-ink)]" : "bg-[var(--color-ink)] text-[var(--color-muted)]"}`}>
                {idx < currentStep ? <CheckCircle className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${idx <= currentStep ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Content Area */}
      <div className="p-8 rounded-xl min-h-[400px] flex flex-col" style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
        
        {/* Step 0: Select Type */}
        {currentStep === 0 && (
          <div className="flex-1">
            <h3 className="text-lg font-medium text-[var(--color-ink)] mb-6">What type of dataset are you importing?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['GeoJSON / Shapefile', 'LAS / LAZ Point Cloud', 'GeoTIFF Orthophoto', 'IFC / BIM Model'].map(t => (
                <button key={t} onClick={() => setSelectedType(t)}
                  className={`p-4 rounded-lg border text-left transition-all ${selectedType === t ? 'border-blue-500 bg-blue-500/10' : 'border-[var(--color-rule)] bg-[var(--color-paper-2)] hover:border-gray-500'}`}>
                  <FileType className={`w-8 h-8 mb-3 ${selectedType === t ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`} />
                  <div className={`font-medium text-sm ${selectedType === t ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]'}`}>{t}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-rule)] rounded-lg bg-[var(--color-paper-2)] p-12 text-center">
            <Upload className="w-12 h-12 text-[var(--color-muted)] mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-ink)] mb-2">Drag and drop your file here</h3>
            <p className="text-sm text-[var(--color-muted)] mb-6">Supported formats for {selectedType}: .geojson, .zip, .shp</p>
            <input type="file" id="file-upload" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <label htmlFor="file-upload" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-[var(--color-ink)] rounded cursor-pointer transition-colors text-sm font-medium">
              Browse Files
            </label>
            {file && <p className="mt-4 text-sm text-green-400 flex items-center gap-2"><File className="w-4 h-4"/> {file.name} selected</p>}
          </div>
        )}

        {/* Step 2-5: Fast forward demo */}
        {currentStep > 1 && currentStep < 6 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <Cpu className={`w-16 h-16 mb-6 ${isProcessing ? 'text-[var(--color-accent)] animate-pulse' : 'text-[var(--color-muted)]'}`} />
             <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">{isProcessing ? "Processing Geometry..." : "Automated Validation"}</h3>
             <p className="text-sm text-[var(--color-muted)] max-w-md">
               {isProcessing ? "Extracting features and generating 3D volumes. This is running via the simulated SIH processing queue." : "System is automatically checking CRS consistency and topological rules."}
             </p>
          </div>
        )}

        {/* Step 7: Publish */}
        {currentStep === 7 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
            <h3 className="text-2xl font-bold text-[var(--color-ink)] mb-2">Dataset Published Successfully</h3>
            <p className="text-[var(--color-muted)] mb-8">The dataset has been ingested into the spatial database and is now available on the 3D Map.</p>
            <Link href="/map" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-[var(--color-ink)] rounded font-medium transition-colors flex items-center gap-2">
              <Map className="w-5 h-5" /> View on Map
            </Link>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-8 pt-6 flex justify-between items-center border-t border-[var(--color-rule)]">
          <button onClick={() => setCurrentStep(c => Math.max(0, c - 1))} disabled={currentStep === 0 || currentStep === 7 || isProcessing}
            className="px-4 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] disabled:opacity-50 transition-colors">
            Back
          </button>
          
          {currentStep < 7 && (
            <button onClick={handleNext} disabled={(currentStep === 0 && !selectedType) || (currentStep === 1 && !file) || isProcessing}
              className="px-6 py-2 bg-[var(--color-paper)] text-black hover:bg-gray-200 rounded text-sm font-medium disabled:opacity-50 flex items-center gap-2 transition-colors">
              {currentStep === 5 ? "Start Processing" : "Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

