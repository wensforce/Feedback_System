import { notFound } from 'next/navigation';
import StateScreen from './components/StateScreen';
import FeedbackFlow from './FeedbackFlow';

export default async function FeedbackPage({ params }) {
  const { token } = await params;

  try {
    // Fetch feedback details from API endpoint
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/feedback?encryptId=${token}`;
    const response = await fetch(apiUrl);
 

    if (!response.ok) {
      notFound();
    }

    const feedback = await response.json();

    if (feedback.alreadySubmitted) {
      return <StateScreen variant="submitted" />;
    }

    return (
      <FeedbackFlow
        token={token}
        hasCar={feedback.hasCar}
        hasBodyguard={feedback.hasBodyguard}
      />
    );
  } catch {
    notFound();
  }
}
