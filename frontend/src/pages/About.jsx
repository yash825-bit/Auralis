import React from 'react'
import MainLayout from '../layouts/MainLayout'
import Aurora from '../components/common/Aurora'

export default function About()
{
  return (
    <MainLayout>
        {/* Aurora Background */}
        <div className="bg-black absolute inset-0">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0}
            amplitude={0.6}
            speed={2}
          />
        </div>

        {/* OUR MISSION */}
        <section className="flex flex-col justify-start items-start text-white relative z-10 px-10 pt-28">
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#FF9F43] via-[#FF4B2B] to-[#FF9F43] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
            Our Mission
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed">
            At <span className="text-white font-semibold">Auralis</span>, our mission is to
            revolutionize hiring with the power of <span className="text-[#FF9F43] font-semibold">AI</span>.
            Recruiters can instantly discover the most relevant candidates using intelligent
            matching, while job seekers find opportunities that perfectly align with their
            resumes and skills — all powered by advanced AI understanding.
          </p>
        </section>

        {/* OUR STORY */}
        <section className="flex flex-col justify-start items-start text-white relative z-10 px-10 pt-4">
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#654EA3] via-[#EAAFC8] to-[#654EA3] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
            Our Story
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed">
            The journey of <span className="text-white font-semibold">Auralis</span> began
            with a vision — to bridge the gap between talent and opportunity.
            What started as a simple idea evolved into an intelligent platform
            where <span className="text-[#cb72ed] font-semibold">AI meets human potential</span>,
            empowering recruiters and candidates alike to connect faster, smarter,
            and more meaningfully than ever before.
          </p>
        </section>

        {/* OUR Cast */}
        <section className="flex flex-col justify-start items-start text-white relative z-10 px-10 pt-4">
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-[#8E2DE2] via-[#4A00E0] to-[#8E2DE2]
 bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg">
            Our Cast
          </h1>

          
        </section>

    </MainLayout>
  )
}
