import React from "react";
import MainLayout from "../layouts/MainLayout";
import Galaxy from "../components/common/Galaxy";
import UfoSpotlight from "../components/common/UfoSpotlight"; // use the UFO component we built earlier

export default function PageNotFound() {
  return (
    <MainLayout>
      <div className="relative w-screen h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black w-full h-full object-cover">
          <Galaxy 
            mouseRepulsion={true}
            mouseInteraction={true}
            density={2.5}
            glowIntensity={0.3}
            saturation={0.5}
            hueShift={140}
            twinkleIntensity={0.6}
            rotationSpeed={0.2}
            repulsionStrength={0.5}
            autoCenterRepulsion={0}
            starSpeed={0.5}
            speed={0.6}
          />
        </div>

        {/* UFO spotlight with text */}
        <UfoSpotlight smallText="Sorry, the page you requested cannot be found" largeText="The Aliens Probably Took It..." className="w-full h-full"/>
      </div>
    </MainLayout>
  );
}
