import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BloomingHeart from "@/components/BloomingHeart";
import ProposalSection from "@/components/ProposalSection";

const Index = () => {
  const [showProposal, setShowProposal] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {!showProposal ? (
          <BloomingHeart 
            key="heart" 
            onComplete={() => setShowProposal(true)} 
          />
        ) : (
          <ProposalSection key="proposal" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
