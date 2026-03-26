import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Share2, 
  Zap, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Calendar,
  Building,
  GraduationCap,
  ExternalLink,
  Code,
  Edit3,
  Save,
  Plus,
  X,
  BarChart3
} from 'lucide-react';

const portfolioData = {
  name: 'Amit Kumar',
  title: 'Full Stack Developer',
  description: 'Passionate developer with expertise in modern web technologies and a strong foundation in computer science. Currently pursuing B.Tech while building innovative projects.',
  contact: {
    email: 'amitkumarhzb75@email.com',
    phone: '+91 9876543210',
    location: 'Indore, India'
  },
  links: {
    github: 'https://github.com/amitkumar',
    linkedin: 'https://linkedin.com/in/amitkumar',
    website: 'https://amitkumar.dev'
  },
  experience: [
    {
      title: 'Frontend Developer Intern',
      company: 'Tech Solutions Pvt Ltd',
      period: 'Jun 2024 - Present',
      description: 'Working on modern web applications using React.js and TypeScript',
      achievements: [
        'Developed responsive web components used by 10k+ users',
        'Improved application performance by 40% through code optimization',
        'Collaborated with cross-functional teams using Agile methodology'
      ]
    },
    {
      title: 'Freelance Web Developer',
      company: 'Self-employed',
      period: 'Jan 2023 - May 2024',
      description: 'Built custom websites and web applications for small businesses',
      achievements: [
        'Delivered 15+ projects with 100% client satisfaction',
        'Implemented SEO best practices increasing organic traffic by 60%',
        'Created e-commerce solutions with payment gateway integration'
      ]
    }
  ],
  projects: [
    {
      name: 'SmartApply.AI',
      description: 'AI-powered job application tracker with resume optimization and interview practice features',
      technologies: ['React', 'TypeScript', 'Supabase', 'OpenAI', 'Tailwind CSS'],
      links: {
        github: 'https://github.com/amitkumar/smartapply',
        demo: 'https://smartapply.dev'
      }
    },
    {
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with admin dashboard, inventory management, and payment processing',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
      links: {
        github: 'https://github.com/amitkumar/ecommerce',
        demo: 'https://shop.example.com'
      }
    },
    {
      name: 'Real-time Chat App',
      description: 'WebSocket-based chat application with file sharing and group messaging capabilities',
      technologies: ['React', 'Socket.io', 'Express.js', 'PostgreSQL'],
      links: {
        github: 'https://github.com/amitkumar/chatapp',
        demo: 'https://chat.example.com'
      }
    }
  ],
  skills: {
    'Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
    'Frontend': ['React', 'Next.js', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
    'Backend': ['Node.js', 'Express.js', 'Django', 'Flask', 'RESTful APIs'],
    'Databases': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase'],
    'Cloud & DevOps': ['AWS', 'Vercel', 'Docker', 'Git', 'GitHub Actions'],
    'Tools': ['VS Code', 'Figma', 'Postman', 'Linux', 'Agile/Scrum']
  },
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'Indore Institute of Science and Technology',
      period: '2022-2026',
      gpa: '7.9/10'
    }
  ]
};

export const Portfolio = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(portfolioData);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Portfolio saved",
      description: "Your portfolio has been successfully updated.",
    });
  };

  const handleAIOptimize = () => {
    toast({
      title: "AI Optimization started",
      description: "Your portfolio is being optimized with AI suggestions.",
    });
    // Simulate AI optimization
    setTimeout(() => {
      toast({
        title: "Portfolio optimized!",
        description: "AI has enhanced your portfolio content and formatting.",
      });
    }, 2000);
  };

  const downloadPDF = () => {
    // Create a new window with print-friendly content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${portfolioData.name} - Portfolio</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
              .section { margin-bottom: 25px; }
              .section h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
              .experience-item, .project-item, .education-item { margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
              .skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
              .skill-category { background: #f8f9fa; padding: 15px; border-radius: 8px; }
              .skill-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
              .skill { background: #e9ecef; padding: 4px 8px; border-radius: 15px; font-size: 12px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${portfolioData.name}</h1>
              <h2>${portfolioData.title}</h2>
              <p>${portfolioData.description}</p>
              <p>${portfolioData.contact.email} | ${portfolioData.contact.phone} | ${portfolioData.contact.location}</p>
            </div>
            
            <div class="section">
              <h2>Professional Experience</h2>
              ${portfolioData.experience.map(exp => `
                <div class="experience-item">
                  <h3>${exp.title} at ${exp.company}</h3>
                  <p><strong>${exp.period}</strong></p>
                  <p>${exp.description}</p>
                  <ul>
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h2>Featured Projects</h2>
              ${portfolioData.projects.map(project => `
                <div class="project-item">
                  <h3>${project.name}</h3>
                  <p>${project.description}</p>
                  <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <h2>Technical Skills</h2>
              <div class="skills">
                ${Object.entries(portfolioData.skills).map(([category, skills]) => `
                  <div class="skill-category">
                    <h4>${category}</h4>
                    <div class="skill-list">
                      ${skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="section">
              <h2>Education</h2>
              ${portfolioData.education.map(edu => `
                <div class="education-item">
                  <h3>${edu.degree}</h3>
                  <p>${edu.institution} | ${edu.period} | GPA: ${edu.gpa}</p>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${portfolioData.name} - Portfolio`,
        text: portfolioData.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Portfolio link has been copied to clipboard.",
      });
    }
  };

  const data = isEditing ? editedData : portfolioData;

  return (
    <div>
      <DashboardHeader 
        title="Portfolio" 
        subtitle="Showcase your professional experience and projects"
      />
      
      <div className="p-8">
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
          <div className="p-8">
            <div className="flex flex-wrap gap-3 mb-6">
              <Button 
                onClick={handleAIOptimize}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
              >
                <Zap className="w-4 h-4 mr-2" />
                AI Optimize
              </Button>
              {isEditing ? (
                <Button onClick={handleSave} variant="outline" className="border-border/50">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="border-border/50">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button onClick={handleShare} variant="outline" className="border-border/50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={downloadPDF} variant="outline" className="border-border/50">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-8 mt-6">
                {/* Header Section */}
                <div className="text-center space-y-4">
                  {isEditing ? (
                    <>
                      <Input 
                        value={editedData.name}
                        onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
                        className="text-4xl font-bold text-center bg-transparent border-0 text-foreground"
                      />
                      <Input 
                        value={editedData.title}
                        onChange={(e) => setEditedData(prev => ({ ...prev, title: e.target.value }))}
                        className="text-xl text-center bg-transparent border-0 text-primary font-medium"
                      />
                      <Textarea 
                        value={editedData.description}
                        onChange={(e) => setEditedData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-transparent border-0 text-center text-muted-foreground resize-none"
                        rows={3}
                      />
                    </>
                  ) : (
                    <>
                      <h1 className="text-4xl font-bold text-foreground">{data.name}</h1>
                      <h2 className="text-xl text-primary font-medium">{data.title}</h2>
                      <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {data.description}
                      </p>
                    </>
                  )}

                  {/* Contact & Social Links */}
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{data.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{data.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{data.contact.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="sm" className="border-border/50">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" size="sm" className="border-border/50">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="border-border/50">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </Button>
                  </div>
                </div>

                {/* Experience Section */}
                <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <Building className="w-6 h-6 mr-3 text-primary" />
                      Professional Experience
                    </h3>
                    <div className="space-y-8">
                      {data.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-6 relative">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2"></div>
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-foreground">{exp.title}</h4>
                            <p className="text-primary font-medium">{exp.company}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2" />
                              {exp.period}
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                              {exp.achievements.map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Projects Section */}
                <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <Code className="w-6 h-6 mr-3 text-primary" />
                      Featured Projects
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {data.projects.map((project, index) => (
                        <Card key={index} className="bg-secondary/30 border-border/30 p-6">
                          <h4 className="text-lg font-semibold text-foreground mb-2">{project.name}</h4>
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.map((tech, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex space-x-3">
                            <Button variant="outline" size="sm" className="text-xs border-border/50">
                              <Github className="w-3 h-3 mr-1" />
                              Code
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs border-border/50">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Demo
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Skills Section */}
                <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <Code className="w-6 h-6 mr-3 text-primary" />
                      Technical Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(data.skills).map(([category, skills]) => (
                        <div key={category} className="space-y-3">
                          <h4 className="text-lg font-semibold text-foreground">{category}</h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-border/50">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Education Section */}
                <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <GraduationCap className="w-6 h-6 mr-3 text-primary" />
                      Education
                    </h3>
                    <div className="space-y-4">
                      {data.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-primary/30 pl-6">
                          <h3 className="text-xl font-semibold text-foreground">{edu.degree}</h3>
                          <p className="text-muted-foreground mb-1">{edu.institution} • {edu.period}</p>
                          <p className="text-muted-foreground">GPA: {edu.gpa}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;