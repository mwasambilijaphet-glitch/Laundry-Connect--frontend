import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-700 dark:text-slate-200" />
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Last updated: March 28, 2026</p>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">1. Introduction</h2>
            <p>
              Laundry Connect ("we", "our", "us") is committed to protecting the privacy of our users
              in Tanzania. This Privacy Policy explains how we collect, use, store, and share your personal
              information when you use the Laundry Connect mobile application and related services.
            </p>
            <p className="mt-2">
              By creating an account or using our platform, you consent to the practices described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">2. Information We Collect</h2>
            <p>We collect the following categories of personal data:</p>

            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">a) Information You Provide</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account details:</strong> Full name, phone number, email address, and password.</li>
              <li><strong>Profile information:</strong> Profile photo (optional) and delivery address.</li>
              <li><strong>Order information:</strong> Garment types, service preferences, special instructions, and order history.</li>
              <li><strong>Payment information:</strong> Mobile money phone number (M-Pesa, Tigo Pesa, etc.) used for transactions. We do not store your mobile money PIN.</li>
              <li><strong>Communications:</strong> Messages sent through the in-app chat between customers and Shops.</li>
            </ul>

            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">b) Information Collected Automatically</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Location data:</strong> Your device location (with your permission) to show nearby laundry shops and enable delivery services.</li>
              <li><strong>Device information:</strong> Device type, operating system, app version, and unique device identifiers.</li>
              <li><strong>Usage data:</strong> Pages visited, features used, search queries, and interaction patterns within the app.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">3. How We Use Your Information</h2>
            <p>Your personal data is used for the following purposes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Service delivery:</strong> To create and manage your account, process orders, facilitate payments, and enable communication between customers and Shops.</li>
              <li><strong>Location services:</strong> To display nearby shops, calculate delivery distances, and provide location-based recommendations.</li>
              <li><strong>Notifications:</strong> To send order status updates, promotional offers, and important service announcements via SMS, push notifications, or WhatsApp.</li>
              <li><strong>Customer support:</strong> To respond to enquiries, resolve disputes, and improve our service quality.</li>
              <li><strong>Platform improvement:</strong> To analyse usage patterns, fix bugs, and develop new features.</li>
              <li><strong>Safety and security:</strong> To detect fraud, prevent abuse, and ensure the safety of our community.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">4. Third-Party Data Sharing</h2>
            <p>We share your information with the following trusted third parties only as necessary to operate the platform:</p>

            <div className="mt-3 space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-semibold text-slate-800 dark:text-white text-xs">NextSMS</p>
                <p className="mt-1">We share your phone number with NextSMS, our SMS gateway provider, to deliver order notifications, OTP verification codes, and important account alerts.</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-semibold text-slate-800 dark:text-white text-xs">Snippe Payment Solutions</p>
                <p className="mt-1">We share your phone number and transaction details with Snippe Payment Solutions to process mobile money payments (M-Pesa, Tigo Pesa, Airtel Money, Halopesa) securely.</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="font-semibold text-slate-800 dark:text-white text-xs">Laundry Shop Owners</p>
                <p className="mt-1">When you place an order, we share your name, phone number, delivery address, and order details with the relevant Shop to fulfil your order.</p>
              </div>
            </div>

            <p className="mt-3">
              We do not sell your personal data to advertisers or other third parties. We may disclose information
              if required by law or to comply with legal processes under Tanzanian law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">5. Data Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your personal data, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Encrypted data transmission using HTTPS/TLS protocols.</li>
              <li>Secure password hashing — we never store passwords in plain text.</li>
              <li>Access controls limiting employee access to personal data on a need-to-know basis.</li>
              <li>Regular security reviews and updates of our systems.</li>
            </ul>
            <p className="mt-2">
              While we take reasonable precautions, no method of electronic transmission or storage is 100%
              secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide you
              with our services. Order history and transaction records are retained for a minimum of 5 years
              to comply with Tanzanian tax and business regulations. If you delete your account, we will
              remove your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">7. Your Rights</h2>
            <p>As a user of Laundry Connect, you have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information in your profile at any time through the app.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated personal data.</li>
              <li><strong>Withdraw consent:</strong> Disable location permissions or opt out of promotional notifications through your device settings.</li>
              <li><strong>Data portability:</strong> Request your data in a commonly used, machine-readable format.</li>
              <li><strong>Objection:</strong> Object to certain processing of your personal data where applicable.</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us using the details below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">8. Children's Privacy</h2>
            <p>
              Laundry Connect is not intended for use by children under the age of 18. We do not knowingly
              collect personal data from children. If we become aware that we have collected data from a
              child, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or
              applicable laws. We will notify you of significant changes through the app or via SMS. Your
              continued use of Laundry Connect after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">10. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
            </p>
            <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <p className="font-semibold text-slate-800 dark:text-white">Laundry Connect</p>
              <p>Email: <a href="mailto:info@laundryconnect.co.tz" className="text-primary-600 dark:text-primary-400 hover:underline">info@laundryconnect.co.tz</a></p>
              <p>Dodoma, Tanzania</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
