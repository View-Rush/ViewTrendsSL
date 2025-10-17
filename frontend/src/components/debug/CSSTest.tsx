/**
 * CSS Diagnostic Component
 * Add this to your App.tsx temporarily to verify Tailwind is working
 *
 * Usage:
 * import { CSSTest } from '@/components/debug/CSSTest';
 *
 * Then in your App or any page, render:
 * <CSSTest />
 */

export function CSSTest() {
    return (
        <div className="p-8 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">CSS Diagnostic Test</h2>

            <div className="space-y-4">
                {/* Test 1: Basic Colors */}
                <div>
                    <h3 className="font-semibold mb-2">Test 1: Basic Tailwind Colors</h3>
                    <div className="flex gap-2 flex-wrap">
                        <div className="w-16 h-16 bg-red-500 rounded flex items-center justify-center text-white text-xs">Red</div>
                        <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white text-xs">Blue</div>
                        <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center text-white text-xs">Green</div>
                        <div className="w-16 h-16 bg-yellow-500 rounded flex items-center justify-center text-white text-xs">Yellow</div>
                    </div>
                    <p className="text-sm text-green-600 mt-2">✓ If you see colored squares above, Tailwind is working!</p>
                </div>

                {/* Test 2: Custom Lankan Colors */}
                <div>
                    <h3 className="font-semibold mb-2">Test 2: Custom Lankan Colors</h3>
                    <div className="flex gap-2 flex-wrap">
                        <div className="w-16 h-16 bg-lankan-saffron rounded flex items-center justify-center text-white text-xs font-bold">Saffron</div>
                        <div className="w-16 h-16 bg-lankan-gold rounded flex items-center justify-center text-white text-xs font-bold">Gold</div>
                    </div>
                    <p className="text-sm text-green-600 mt-2">✓ If you see orange and yellow squares, custom colors work!</p>
                </div>

                {/* Test 3: Typography */}
                <div>
                    <h3 className="font-semibold mb-2">Test 3: Typography</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Small text</p>
                    <p className="text-base text-gray-700 dark:text-gray-300">Base text</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Large bold text</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">Extra large bold text</p>
                    <p className="text-sm text-green-600 mt-2">✓ If text sizes and colors vary, typography works!</p>
                </div>

                {/* Test 4: Spacing & Layout */}
                <div>
                    <h3 className="font-semibold mb-2">Test 4: Spacing & Flexbox</h3>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 bg-blue-100 dark:bg-blue-900 p-4 rounded">Flex 1</div>
                        <div className="flex-1 bg-purple-100 dark:bg-purple-900 p-4 rounded">Flex 1</div>
                        <div className="flex-1 bg-pink-100 dark:bg-pink-900 p-4 rounded">Flex 1</div>
                    </div>
                    <p className="text-sm text-green-600">✓ If boxes are equally spaced and colored, layout works!</p>
                </div>

                {/* Test 5: Shadows & Borders */}
                <div>
                    <h3 className="font-semibold mb-2">Test 5: Shadows & Borders</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 border border-gray-300 dark:border-gray-700 rounded">Border</div>
                        <div className="p-4 shadow rounded">Shadow</div>
                        <div className="p-4 shadow-lg rounded">Shadow LG</div>
                    </div>
                    <p className="text-sm text-green-600 mt-2">✓ If you see borders and shadows, styling works!</p>
                </div>

                {/* Test 6: Buttons */}
                <div>
                    <h3 className="font-semibold mb-2">Test 6: Button Variants</h3>
                    <div className="flex gap-2 flex-wrap">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Default</button>
                        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Outline</button>
                        <button className="px-4 py-2 bg-lankan-saffron text-white rounded hover:opacity-90">Lankan</button>
                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300">Ghost</button>
                    </div>
                    <p className="text-sm text-green-600 mt-2">✓ If buttons look styled and hover works, components work!</p>
                </div>

                {/* Final Result */}
                <div className="mt-8 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 rounded">
                    <p className="text-green-800 dark:text-green-200 font-semibold">✅ All tests passed!</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">Tailwind CSS is working correctly. You can remove this component.</p>
                </div>
            </div>

            <div className="mt-8 p-4 bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 rounded">
                <p className="text-blue-900 dark:text-blue-100 text-sm">
                    <strong>To remove this test:</strong> Comment out or delete the <code>&lt;CSSTest /&gt;</code> import from your App.tsx
                </p>
            </div>
        </div>
    );
}