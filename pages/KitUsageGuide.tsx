import React, { useState } from 'react';
import { askWaterSafetyQuestion, generateEcoliTestImage } from '../services/geminiService';

const KitUsageGuide: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        
        setIsLoading(true);
        setAnswer('');
        const result = await askWaterSafetyQuestion(question);
        setAnswer(result);
        setIsLoading(false);
    };

    const handleGenerateImage = async () => {
        setIsImageLoading(true);
        setGeneratedImage(null);
        setImageError(null);
        try {
            const result = await generateEcoliTestImage();
            setGeneratedImage(result);
        } catch (err) {
            setImageError((err as Error).message);
        } finally {
            setIsImageLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-4">
                E. coli Water Testing Kit Guide
            </h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">How to Use Your Kit</h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                        <div>
                            <h3 className="font-semibold">Preparation</h3>
                            <p>Wash your hands thoroughly with soap and water. Do not touch the inside of the sample bottle or its cap.</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                        <div>
                            <h3 className="font-semibold">Collect Sample</h3>
                            <p>Carefully open the sample bottle. Fill it with water up to the marked line (usually 100ml). Secure the cap tightly.</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                        <div>
                            <h3 className="font-semibold">Add Reagent</h3>
                            <p>Open the reagent packet and carefully pour the entire contents into the water sample. Screw the cap back on tightly.</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                        <div>
                            <h3 className="font-semibold">Incubate</h3>
                            <p>Shake the bottle until the powder is completely dissolved. Store the bottle in a warm, dark place (25-35°C) for 24-48 hours, away from direct sunlight.</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
                        <div>
                            <h3 className="font-semibold">Interpret Results</h3>
                            <p>After the incubation period, observe the color of the water. A change to yellow or fluorescent under UV light indicates the presence of E. coli. No color change means the water is likely safe.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="pt-8 border-t">
                 <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Ask a Question</h2>
                 <p className="text-gray-600 dark:text-gray-400 mb-4">Have a question about water safety, testing, or sanitation? Ask our AI assistant.</p>
                 <form onSubmit={handleQuestionSubmit} className="flex flex-col sm:flex-row gap-2">
                     <input 
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., What should I do if my water test is positive?"
                        className="flex-grow w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <button type="submit" disabled={isLoading} className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                        {isLoading ? 'Thinking...' : 'Ask'}
                     </button>
                 </form>
                 {answer && (
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{answer}</p>
                    </div>
                 )}
            </section>

             <section className="pt-8 border-t mt-8">
                <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Visualize Test Results</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Generate an AI-powered example image of positive and negative E. coli test results to better understand what to look for.
                </p>
                <button onClick={handleGenerateImage} disabled={isImageLoading} className="bg-green-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300">
                    {isImageLoading ? 'Generating...' : 'Generate Example Image'}
                </button>
                
                <div className="mt-6 flex justify-center items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-md min-h-[256px]">
                    {isImageLoading && <p className="text-gray-600 dark:text-gray-300">Generating image, please wait...</p>}
                    {imageError && <p className="text-red-500">{imageError}</p>}
                    {generatedImage && (
                        <img 
                            src={`data:image/png;base64,${generatedImage}`} 
                            alt="AI generated E. coli test results"
                            className="rounded-md shadow-lg max-w-full h-auto"
                        />
                    )}
                    {!isImageLoading && !imageError && !generatedImage && <p className="text-gray-500">Image will appear here</p>}
                </div>
            </section>
        </div>
    );
};

export default KitUsageGuide;