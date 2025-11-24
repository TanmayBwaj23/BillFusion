import React, { useState } from 'react';
import { Spinner, SpinnerWithText, SpinnerCentered } from './Spinner';
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonTableRow, 
  SkeletonAvatar, 
  SkeletonInput 
} from './Skeleton';
import { LoadingOverlay, LoadingPage, ButtonLoading } from './LoadingOverlay';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';

/**
 * LoadingExamples Component
 * Demonstrates all loading state components
 * This is for development/documentation purposes only
 */
export function LoadingExamples() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showPageLoading, setShowPageLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleOverlayDemo = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 2000);
  };

  const handlePageLoadingDemo = () => {
    setShowPageLoading(true);
    setTimeout(() => setShowPageLoading(false), 2000);
  };

  const handleButtonDemo = () => {
    setIsButtonLoading(true);
    setTimeout(() => setIsButtonLoading(false), 2000);
  };

  if (showPageLoading) {
    return <LoadingPage text="Demo: Full page loading..." />;
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Loading Components Demo</h1>
        <p className="text-gray-600">Examples of all loading state components</p>
      </div>

      {/* Spinners */}
      <Card>
        <CardHeader>
          <CardTitle>Spinners</CardTitle>
          <CardDescription>Basic spinner components in different sizes and variants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Sizes</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Spinner size="sm" />
                <p className="text-xs mt-2">Small</p>
              </div>
              <div className="text-center">
                <Spinner size="md" />
                <p className="text-xs mt-2">Medium</p>
              </div>
              <div className="text-center">
                <Spinner size="lg" />
                <p className="text-xs mt-2">Large</p>
              </div>
              <div className="text-center">
                <Spinner size="xl" />
                <p className="text-xs mt-2">Extra Large</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Variants</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <Spinner variant="primary" />
                <p className="text-xs mt-2">Primary</p>
              </div>
              <div className="text-center bg-gray-800 p-4 rounded">
                <Spinner variant="white" />
                <p className="text-xs mt-2 text-white">White</p>
              </div>
              <div className="text-center">
                <Spinner variant="gray" />
                <p className="text-xs mt-2">Gray</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">With Text</h3>
            <SpinnerWithText text="Loading data..." />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Centered</h3>
            <div className="border rounded-lg h-48">
              <SpinnerCentered />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Loaders */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Loaders</CardTitle>
          <CardDescription>Content placeholders for data fetching states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Basic Skeletons</h3>
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton variant="circular" className="h-12 w-12" />
              <Skeleton variant="text" className="h-4 w-3/4" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Text Lines</h3>
            <SkeletonText lines={4} />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Card Skeleton</h3>
            <SkeletonCard />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Table Row</h3>
            <div className="space-y-2">
              <SkeletonTableRow columns={4} />
              <SkeletonTableRow columns={4} />
              <SkeletonTableRow columns={4} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Avatar</h3>
            <SkeletonAvatar withText={true} />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Form Input</h3>
            <SkeletonInput label={true} />
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlays */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Overlays</CardTitle>
          <CardDescription>Overlay components for async operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Container Overlay</h3>
            <LoadingOverlay isLoading={showOverlay} text="Processing...">
              <div className="border rounded-lg p-6 bg-gray-50">
                <p className="text-gray-700">This content will be covered by an overlay when loading.</p>
                <Button onClick={handleOverlayDemo} className="mt-4">
                  Show Overlay (2s)
                </Button>
              </div>
            </LoadingOverlay>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Full Page Loading</h3>
            <Button onClick={handlePageLoadingDemo}>
              Show Full Page Loading (2s)
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Button Loading</h3>
            <div className="flex gap-4">
              <Button onClick={handleButtonDemo} disabled={isButtonLoading}>
                {isButtonLoading ? <ButtonLoading text="Processing..." /> : 'Click Me'}
              </Button>
              <Button onClick={handleButtonDemo} disabled={isButtonLoading} variant="outline">
                {isButtonLoading ? <ButtonLoading text="Saving..." variant="gray" /> : 'Save'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>How to use these components in your code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`// Button with loading state
<Button disabled={isLoading}>
  {isLoading ? <ButtonLoading text="Saving..." /> : 'Save'}
</Button>

// Data fetching with skeleton
{isLoading ? (
  <SkeletonCard />
) : (
  <Card>{/* actual content */}</Card>
)}

// Protected route with loading page
if (isChecking) {
  return <LoadingPage text="Verifying..." />;
}

// Container with overlay
<LoadingOverlay isLoading={isRefreshing} text="Refreshing...">
  <YourContent />
</LoadingOverlay>`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoadingExamples;
