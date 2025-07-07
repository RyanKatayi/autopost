import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - AutoPost AI",
  description: "Privacy policy for AutoPost AI LinkedIn automation platform",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Privacy Policy</h1>
          
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">1. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                We collect information you provide directly to us when you:
              </p>
              <ul className="list-disc pl-4 sm:pl-6 text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base space-y-1">
                <li>Create an account (email address, name, password)</li>
                <li>Connect your LinkedIn account for automation</li>
                <li>Generate and schedule posts through our AI platform</li>
                <li>Contact us for support or feedback</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn Data</h3>
              <p className="text-gray-700 mb-3 text-sm sm:text-base">
                When you connect your LinkedIn account, we may access and store:
              </p>
              <ul className="list-disc pl-4 sm:pl-6 text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base space-y-1">
                <li>Profile information (name, headline, profile picture)</li>
                <li>Connection data for targeting and engagement optimization</li>
                <li>Post content you create, edit, or schedule through our platform</li>
                <li>Engagement metrics (likes, comments, shares) for performance analysis</li>
                <li>Access tokens necessary for posting and account management</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage and Technical Data</h3>
              <ul className="list-disc pl-4 sm:pl-6 text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base space-y-1">
                <li>Log data (IP address, browser type, operating system)</li>
                <li>Usage patterns and feature interactions</li>
                <li>Device information and unique identifiers</li>
                <li>Cookies and similar tracking technologies</li>
                <li>AI-generated content and user modifications to that content</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-4 sm:pl-6 text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base space-y-1">
                <li>Provide, maintain, and improve our LinkedIn automation services</li>
                <li>Generate AI-powered content based on your preferences and industry context</li>
                <li>Schedule and publish posts to your LinkedIn account in compliance with LinkedIn&apos;s terms</li>
                <li>Analyze post performance and provide engagement insights</li>
                <li>Communicate with you about your account and our services</li>
                <li>Ensure compliance with LinkedIn&apos;s API usage policies and rate limits</li>
                <li>Detect and prevent fraud, abuse, or violations of our terms of service</li>
                <li>Improve our AI models and content generation capabilities (anonymized data only)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">AI and Machine Learning</h3>
              <p className="text-gray-700 mb-3 text-sm sm:text-base">
                Our AI systems process your content inputs and LinkedIn data to generate personalized posts. We may use aggregated, anonymized data to improve our AI models, but we never use your personal content or identifiable information for training purposes without your explicit consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>With LinkedIn, as necessary to provide our automation services</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Secure authentication and authorization protocols</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access, update, or delete your personal information</li>
                <li>Disconnect your LinkedIn account at any time</li>
                <li>Request a copy of your data</li>
                <li>Opt out of non-essential communications</li>
                <li>Request deletion of your account and associated data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. When you delete your account, we will delete your personal information within 30 days, except where we are required to retain it by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. LinkedIn Integration and Compliance</h2>
              <p className="text-gray-700 mb-4">
                Our service operates in compliance with LinkedIn&apos;s Developer Terms and API policies. We:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Respect LinkedIn&apos;s rate limits and usage guidelines</li>
                <li>Only access LinkedIn data necessary for our services</li>
                <li>Comply with LinkedIn&apos;s content and posting policies</li>
                <li>Immediately cease access if you revoke LinkedIn permissions</li>
                <li>Do not store LinkedIn access tokens longer than necessary</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can revoke our access to your LinkedIn account at any time through LinkedIn&apos;s privacy settings or by disconnecting your account in our dashboard.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Maintain your login session and preferences</li>
                <li>Analyze usage patterns and improve our services</li>
                <li>Provide personalized content and recommendations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may limit your ability to use some features of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers and Compliance</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GDPR (European Users)</h3>
              <p className="text-gray-700 mb-4">
                If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR), including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to lodge a complaint with supervisory authorities</li>
                <li>Right to withdraw consent at any time</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">CCPA (California Users)</h3>
              <p className="text-gray-700 mb-4">
                California residents have specific rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, use, and share, and the right to delete personal information.
              </p>

              <p className="text-gray-700 mb-4">
                We may transfer your data to servers located outside your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 16 years of age (or under 13 in the United States). We do not knowingly collect personal information from children under these ages. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our service integrates with LinkedIn and may use other third-party services including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>LinkedIn API for account integration and posting</li>
                <li>Analytics services for usage tracking</li>
                <li>Cloud infrastructure providers for data storage</li>
                <li>AI/ML services for content generation</li>
              </ul>
              <p className="text-gray-700 mb-4">
                These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of these third-party services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Data Breach Notification</h2>
              <p className="text-gray-700 mb-4">
                In the event of a data breach that may compromise your personal information, we will notify you and relevant authorities within 72 hours of becoming aware of the breach, as required by applicable law. We will provide details about the nature of the breach, the data involved, and steps we are taking to address the issue.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new privacy policy on this page and updating the &quot;last updated&quot; date. For significant changes, we may also notify you via email or through our service. Your continued use of our services after any changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this privacy policy, our privacy practices, or wish to exercise your privacy rights, please contact us at:
              </p>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-700 text-sm sm:text-base">
                  <strong>Email:</strong> ryan@ryankatayi.com<br />
                </p>
              </div>
              <p className="text-gray-700 mt-4 text-sm sm:text-base">
                We will respond to your inquiry within 30 days (or as required by applicable law).
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}