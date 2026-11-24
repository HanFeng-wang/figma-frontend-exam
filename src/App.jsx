import { useRef, useState } from 'react';
import resumeIllustration from './assets/resume-illustration.png';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAcceptedFile(file) {
  const filename = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => filename.endsWith(extension));
}

function UploadIcon() {
  return (
    <svg
      className="upload-icon"
      viewBox="0 0 58 42"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15.7 35.8h-2.1C7.7 35.8 3 31.4 3 26c0-4.6 3.5-8.5 8-9.3C12.2 10 18.1 5.2 25.2 5.2c7.7 0 14.1 5.7 15.2 13.1 5.1.6 8.9 4.7 8.9 9.7 0 5.4-4.6 9.8-10.5 9.8h-1.2"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.6 39V22.8m0 0-6.1 6.1m6.1-6.1 6.1 6.1"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <span className="file-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M6.75 2.75h7.5l4 4v14.5H6.75V2.75Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M14.25 2.75v4h4M9.25 12h5.5M9.25 15.5h5.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function ProgressSteps() {
  return (
    <ol className="progress-steps" aria-label="Application progress">
      <li className="progress-steps__item is-complete">
        <span className="progress-steps__marker" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="m7 12.2 3.2 3.2 6.8-6.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="sr-only">Resume upload, completed</span>
      </li>
      <li className="progress-steps__item is-complete">
        <span className="progress-steps__marker" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="m7 12.2 3.2 3.2 6.8-6.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="sr-only">Resume parsing, completed</span>
      </li>
      <li className="progress-steps__item" aria-current="step">
        <span className="progress-steps__marker" aria-hidden="true">
          3
        </span>
        <span className="sr-only">Profile review, step 3, not completed</span>
      </li>
    </ol>
  );
}

function App() {
  const inputRef = useRef(null);
  const dragDepth = useRef(0);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [notice, setNotice] = useState('');
  const [hasError, setHasError] = useState(false);

  const refreshFile = (candidate) => {
    if (!candidate) return;

    setNotice('');
    setHasError(false);

    if (!isAcceptedFile(candidate)) {
      setHasError(true);
      setNotice('Please choose a PDF, DOC, DOCX, or TXT file.');
      return;
    }

    if (candidate.size > MAX_FILE_SIZE) {
      setHasError(true);
      setNotice('This file is larger than 10 MB. Please choose a smaller file.');
      return;
    }

    setFile(candidate);
  };

  const openFilePicker = () => {
    setNotice('');
    inputRef.current?.click();
  };

  const handleDropzoneKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFilePicker();
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    refreshFile(event.dataTransfer.files?.[0]);
  };

  const finishUpload = () => {
    if (!file) {
      setHasError(true);
      setNotice('Add your resume first, then select Finish.');
      document.querySelector('.dropzone')?.focus();
      return;
    }

    setHasError(false);
    setNotice(`${file.name} is ready to finish.`);
  };

  const goBack = () => {
    setHasError(false);
    setNotice('Resume upload is the first step in this flow.');
  };

  const dropzoneClassName = [
    'dropzone',
    isDragging ? 'is-dragging' : '',
    hasError ? 'has-error' : '',
    file ? 'has-file' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className="page-shell">
      <div className="page-layout">
        <section className="intro" aria-labelledby="page-title">
          <div className="intro__copy">
            <p className="intro__eyebrow">Finish!</p>
            <h1 id="page-title">Upload Your Resume</h1>
            <p className="intro__description">
              Upload your resume, the platform will help you parse and optimize
              your resume in this step.
            </p>
          </div>

          <img
            className="intro__illustration"
            src={resumeIllustration}
            alt="A blue cat looking at a phone surrounded by chat messages"
            width="696"
            height="597"
            decoding="async"
          />
        </section>

        <section className="upload-card" aria-labelledby="upload-title">
          <div className="upload-card__header">
            <h2 id="upload-title">Upload file</h2>
          </div>

          <div
            className={dropzoneClassName}
            role="button"
            tabIndex="0"
            aria-label="Upload resume"
            aria-controls="resume-file"
            aria-describedby={file ? 'upload-notice' : 'upload-help upload-notice'}
            onClick={openFilePicker}
            onKeyDown={handleDropzoneKeyDown}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              id="resume-file"
              className="sr-only"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(event) => {
                refreshFile(event.target.files?.[0]);
                event.target.value = '';
              }}
            />

            {file ? (
              <div className="file-preview">
                <FileIcon />
                <div className="file-preview__copy">
                  <strong>{file.name}</strong>
                  <span>{formatFileSize(file.size)} · Ready to finish</span>
                </div>
                <span className="file-preview__replace">Replace</span>
              </div>
            ) : (
              <div className="dropzone__empty">
                <UploadIcon />
                <p id="upload-help">
                  Drag your resume file to this area, or click on the area to
                  select the appropriate file to upload.
                </p>
              </div>
            )}
          </div>

          <p
            id="upload-notice"
            className={`upload-notice ${hasError ? 'is-error' : ''}`}
            aria-live="polite"
          >
            {notice}
          </p>

          <div className="action-row">
            <button className="button button--secondary" type="button" onClick={goBack}>
              Last step
            </button>
            <button className="button button--primary" type="button" onClick={finishUpload}>
              Finish
            </button>
          </div>

          <ProgressSteps />
        </section>
      </div>
    </main>
  );
}

export default App;
