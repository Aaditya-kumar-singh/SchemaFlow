import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-blue-600 animate-pulse">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
          <p className="text-slate-500 text-sm">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="border-t border-slate-100 pt-6 flex flex-col gap-3">
          <Link href="/" passHref>
            <Button id="btn-404-go-home" className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/price" passHref>
            <Button id="btn-404-view-pricing" variant="outline" className="w-full h-11 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50">
              View Pricing Plans
            </Button>
          </Link>
        </div>
        <div className="text-xs text-slate-400">
          Need help? <a href="mailto:support@schemaflow.com" className="text-blue-500 hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
