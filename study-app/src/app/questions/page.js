import QuestionGenerator from '@/components/QuestionGenerator';

export default function QuestionsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Study Questions</h1>
      <QuestionGenerator />
    </div>
  );
}