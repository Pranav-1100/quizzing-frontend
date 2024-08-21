'use client';

import Link from 'next/link';
import AnimatedCard from '@/components/AnimatedCard';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to StudyApp</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Generate Questions"
          description="Create custom questions based on your study needs."
          link="/questions"
        />
        <FeatureCard
          title="Study Notes"
          description="Generate and manage your study notes effortlessly."
          link="/notes"
        />
        <FeatureCard
          title="Study Plan"
          description="Create a personalized study plan to ace your exams."
          link="/study-plan"
        />
        <FeatureCard
          title="Doubts Forum"
          description="Ask questions and get help from the community."
          link="/doubts"
        />
        <FeatureCard
          title="Profile"
          description="Manage your profile and preferences."
          link="/profile"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, link }) {
  return (
    <AnimatedCard>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={link} className="btn btn-primary">
        Get Started
      </Link>
    </AnimatedCard>
  );
}