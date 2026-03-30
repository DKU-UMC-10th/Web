import { ThemeProvider } from './context/ThemeProvider';
import Navbar from './Navbar';
import ThemeContent from './ThemeContent';

export default function ContextPage() {
    return (
        <ThemeProvider>
            <div className='min-h-screen'>
                <Navbar />
                <main className='w-full'>
                    <ThemeContent />
                </main>
            </div>        
        </ThemeProvider>
    );
}