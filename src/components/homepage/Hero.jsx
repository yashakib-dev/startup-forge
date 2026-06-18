"use client";

import React from 'react';
import NextLink from 'next/link';
import { Button } from "@heroui/react";
import { motion } from 'framer-motion';
import { FaLongArrowAltRight } from "react-icons/fa";

const Hero = () => {
  
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 },
        },
    };


    return (
        <section className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-zinc-950 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 flex items-center justify-center">

            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 h-[300px] w-[300px] sm:h-[600px] sm:w-[600px] rounded-full bg-blue-600/10 blur-[80px] sm:blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 h-[300px] w-[300px] sm:h-[600px] sm:w-[600px] rounded-full bg-indigo-600/10 blur-[80px] sm:blur-[120px] pointer-events-none" />
            

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

            <div className="relative mx-auto max-w-5xl w-full z-10 flex flex-col items-center justify-center text-center">
                
                <motion.div
                    className="flex flex-col items-center text-center w-full max-w-3xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
       
           
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-400 backdrop-blur-md"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                        <span>Bridging Founders and Talented Collaborators</span>
                    </motion.div>

      
                    <motion.h1
                        variants={itemVariants}
                        className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight text-center"
                    >
                        Where Bold Ideas <br />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            Meet Elite Collaborators
                        </span>
                    </motion.h1>

                  
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-3xl text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed text-center mx-auto"
                    >
                        StartupForge bridges the gap between visionary founders and talented professionals. Publish your startup ideas and recruit core teammates, or explore open opportunities as a developer, designer, or marketer to help build the future together.
                    </motion.p>

            
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex flex-wrap gap-4 justify-center w-full sm:w-auto"
                    >
                        <Button
                            as={NextLink}
                            href="/register"
                            color="primary"
                            variant="solid"
                            size="lg"
                            className="w-full sm:w-auto font-semibold p-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all hover:scale-105 duration-200 border-none rounded-xl"
                        >
                            Publish an Idea
                           <FaLongArrowAltRight />
                        </Button>
                        <Button
                            as={NextLink}
                            href="/opportunities"
                            variant="bordered"
                            size="lg"
                            className="w-full sm:w-auto font-semibold border-zinc-700 border py-6 text-zinc-300 hover:bg-zinc-900/50 hover:text-white transition-all hover:scale-105 duration-200 rounded-xl"
                        >
                            Find Opportunities
                        </Button>
                    </motion.div>

              
                    <motion.div
                        variants={itemVariants}
                        className="mt-16 pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-6 w-full max-w-md text-center"
                    >
                        <div>
                            <p className="text-2xl sm:text-3xl font-extrabold text-white">450+</p>
                            <p className="text-xs sm:text-sm text-zinc-500">Startup Ideas</p>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-extrabold text-white">1.2k+</p>
                            <p className="text-xs sm:text-sm text-zinc-500">Teams Formed</p>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-extrabold text-white">15k+</p>
                            <p className="text-xs sm:text-sm text-zinc-500">Global Builders</p>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
