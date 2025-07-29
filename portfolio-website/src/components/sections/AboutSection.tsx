"use client";

import { motion } from "framer-motion";
import { Download, MapPin, Calendar, Award, Users, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Code, label: "Projects Completed", value: "50+" },
  { icon: Users, label: "Happy Clients", value: "25+" },
  { icon: Award, label: "Years Experience", value: "5+" },
  { icon: Calendar, label: "Lines of Code", value: "100K+" },
];

const timeline = [
  {
    year: "2024",
    title: "Senior Full Stack Developer",
    company: "Tech Innovation Inc.",
    description:
      "Leading development of scalable web applications using modern technologies.",
  },
  {
    year: "2022",
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    description:
      "Developed and maintained multiple client projects with React and Node.js.",
  },
  {
    year: "2020",
    title: "Frontend Developer",
    company: "Creative Agency",
    description:
      "Specialized in creating beautiful, responsive user interfaces and experiences.",
  },
  {
    year: "2019",
    title: "Junior Developer",
    company: "StartUp Ventures",
    description:
      "Started my professional journey building web applications and learning best practices.",
  },
];

const ResumeDownloadButton = () => {
  const handleDownload = () => {
    // In a real application, this would trigger the actual resume download
    const link = document.createElement("a");
    link.href = "/resume.pdf"; // You would replace this with your actual resume file
    link.download = "John_Doe_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.button
      onClick={handleDownload}
      className={cn(
        "group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500",
        "text-white font-semibold rounded-full overflow-hidden",
        "hover:shadow-2xl hover:shadow-primary-500/25",
        "transition-all duration-300 transform hover:scale-105"
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-center space-x-2">
        <Download className="w-5 h-5 group-hover:animate-bounce" />
        <span>Download Resume</span>
      </div>
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </motion.button>
  );
};

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-primary-500">Me</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Passionate developer and designer with a love for creating
            exceptional digital experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Profile Image and Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative">
              <div className="w-64 h-64 mx-auto lg:mx-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1">
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-600 dark:text-gray-300">
                    JD
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary-500 text-white p-3 rounded-full">
                <Code className="w-6 h-6" />
              </div>
            </div>

            <div className="text-center lg:text-left space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                John Doe
              </h3>
              <p className="text-lg text-primary-500 font-medium">
                Senior Full Stack Developer & UI/UX Designer
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            <ResumeDownloadButton />
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I&apos;m a passionate full-stack developer with over 5 years of
                experience creating digital solutions that make a difference. My
                journey began with a curiosity about how things work on the web,
                and it has evolved into a deep love for crafting beautiful,
                functional, and user-centered applications.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I specialize in modern web technologies including React,
                Next.js, Node.js, and TypeScript. When I&apos;m not coding,
                you&apos;ll find me exploring new design trends, contributing to
                open-source projects, or capturing moments through photography.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I believe in the power of collaboration and continuous learning.
                Every project is an opportunity to push boundaries and create
                something extraordinary.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500/10 rounded-full mb-4">
                <stat.icon className="w-6 h-6 text-primary-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Professional Journey
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary-500/30" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={cn(
                    "relative flex items-center",
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 bg-primary-500 rounded-full border-4 border-white dark:border-gray-900" />

                  {/* Content */}
                  <div
                    className={cn(
                      "ml-12 md:ml-0 md:w-1/2",
                      index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                    )}
                  >
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <div className="text-primary-500 font-bold text-sm mb-1">
                        {item.year}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <div className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                        {item.company}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
