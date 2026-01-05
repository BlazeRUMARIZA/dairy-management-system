import React from 'react'
import { Card } from '../../components/UI/Card'
import { Button } from '../../components/UI/Button'
import { 
  HelpCircle, MessageCircle, Mail, Phone, FileText, 
  ExternalLink, BookOpen, Video, Users, Zap
} from 'lucide-react'

const Support: React.FC = () => {
  const faqs = [
    {
      question: 'How do I create a new production batch?',
      answer: 'Navigate to Production > Click "New Batch" > Fill in the product details, quantity, and scheduled time > Submit.',
    },
    {
      question: 'How can I track an order?',
      answer: 'Go to Orders & Deliveries > Find your order > Click on it to see the current status and tracking information.',
    },
    {
      question: 'What do the different order statuses mean?',
      answer: 'Pending: Awaiting confirmation, Confirmed: Order accepted, In Progress: Being prepared, In Transit: Out for delivery, Delivered: Successfully completed.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'On the login page, click "Forgot Password" > Enter your email > Follow the reset link sent to your inbox.',
    },
    {
      question: 'How can I export reports?',
      answer: 'Go to Reports & Analytics > Select your report type and date range > Click "Export Report" to download.',
    },
  ]

  const resources = [
    {
      icon: BookOpen,
      title: 'User Guide',
      description: 'Complete documentation for all features',
      link: '#',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video walkthroughs',
      link: '#',
    },
    {
      icon: FileText,
      title: 'API Documentation',
      description: 'Technical API reference guide',
      link: '#',
    },
    {
      icon: Zap,
      title: 'Quick Start Guide',
      description: 'Get up and running in minutes',
      link: '#',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <HelpCircle className="text-primary-500" size={32} />
          Help & Support
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Get help with DairyPro Management System
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <MessageCircle className="text-blue-600 dark:text-blue-300" size={28} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Chat with our support team in real-time
          </p>
          <Button variant="primary" className="w-full">
            Start Chat
          </Button>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <Mail className="text-green-600 dark:text-green-300" size={28} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Send us an email and we'll respond within 24h
          </p>
          <a href="mailto:support@dairypro.com">
            <Button variant="secondary" className="w-full">
              support@dairypro.com
            </Button>
          </a>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <Phone className="text-purple-600 dark:text-purple-300" size={28} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Call us Mon-Fri, 8am-6pm EAT
          </p>
          <a href="tel:+250788000000">
            <Button variant="secondary" className="w-full">
              +250 788 000 000
            </Button>
          </a>
        </Card>
      </div>

      {/* Resources */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="text-primary-500" size={24} />
          Resources & Documentation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <resource.icon className="text-primary-500 mb-3" size={24} />
              <h3 className="font-medium mb-1 group-hover:text-primary-600 transition-colors">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {resource.description}
              </p>
              <div className="flex items-center gap-1 text-primary-600 text-sm mt-2">
                <span>View</span>
                <ExternalLink size={14} />
              </div>
            </a>
          ))}
        </div>
      </Card>

      {/* FAQs */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="text-primary-500" size={24} />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="font-medium">{faq.question}</span>
                <span className="text-primary-500 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </Card>

      {/* System Info */}
      <Card className="bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">DairyPro Management System</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Version 1.0.0 | © 2026 DairyPro
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Community Support Available
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Support

