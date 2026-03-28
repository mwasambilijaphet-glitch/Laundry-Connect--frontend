import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">Terms of Service</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Last updated: March 28, 2026</p>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">1. Service Description</h2>
            <p>
              Laundry Connect is a digital marketplace platform operating in the United Republic of Tanzania
              that connects customers with local laundry service providers ("Shops"). The platform enables
              customers to discover nearby laundry shops, place orders for washing, ironing, dry cleaning,
              and related garment care services, track order status, and make payments through the app.
            </p>
            <p className="mt-2">
              Laundry Connect acts solely as an intermediary between customers and independent laundry
              service providers. We do not directly provide laundry services, and each Shop is independently
              owned and operated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">2. Eligibility</h2>
            <p>
              By using Laundry Connect, you confirm that you are at least 18 years of age or have the consent
              of a parent or guardian, and that you are capable of entering into a binding agreement under the
              laws of Tanzania.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">3. User Accounts and Responsibilities</h2>
            <p>To use our services, you must create an account and provide accurate information including your name, phone number, and email address. You are responsible for:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>Providing accurate and complete information when placing orders, including garment descriptions and special instructions.</li>
              <li>Ensuring items submitted for laundry do not contain hazardous substances, valuables left in pockets, or prohibited items.</li>
              <li>Inspecting completed orders upon delivery or pickup and reporting any issues within 24 hours.</li>
              <li>Treating Shop owners, delivery personnel, and other users with respect.</li>
              <li>Not using the platform for any unlawful purpose or in violation of these Terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">4. Shop Owner Responsibilities</h2>
            <p>If you register as a Shop owner on Laundry Connect, you agree to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide accurate information about your services, pricing, and operating hours.</li>
              <li>Handle all garments with reasonable care and in accordance with the service description.</li>
              <li>Complete orders within the agreed timeframe.</li>
              <li>Comply with all applicable Tanzanian laws and regulations, including business licensing requirements.</li>
              <li>Maintain hygiene and quality standards expected by customers.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">5. Payment Terms</h2>
            <p>
              Laundry Connect supports multiple payment methods available in Tanzania, including but not limited to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Mobile Money (M-Pesa, Tigo Pesa, Airtel Money, Halopesa)</strong> — Payments are processed through our integrated payment partner, Snippe Payment Solutions.</li>
              <li><strong>Cash on Delivery / Cash at Pickup</strong> — You may pay the Shop directly in Tanzanian Shillings (TZS) upon delivery or collection of your order.</li>
            </ul>
            <p className="mt-2">
              All prices displayed on the platform are in Tanzanian Shillings (TZS) and are set by
              individual Shops. Laundry Connect may charge a service fee or commission on transactions,
              which will be clearly disclosed before you confirm an order. Payment processing fees from
              mobile money providers may apply.
            </p>
            <p className="mt-2">
              Refunds, where applicable, will be processed through the original payment method. Disputes
              regarding payment should be raised within 48 hours of the transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">6. Order Cancellation</h2>
            <p>
              Customers may cancel an order before the Shop has begun processing it, at no charge. Once
              processing has started, cancellation may not be possible or may incur a partial charge as
              determined by the Shop's cancellation policy. Laundry Connect reserves the right to cancel
              orders in cases of suspected fraud, abuse, or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by the laws of Tanzania:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Laundry Connect is not liable for the quality of laundry services provided by Shops. Any disputes regarding service quality should be resolved directly with the Shop, though we will assist in mediation where possible.</li>
              <li>Laundry Connect is not responsible for loss, damage, discolouration, or shrinkage of garments while in the care of a Shop.</li>
              <li>Our total liability to any user shall not exceed the amount paid by that user for the specific order in question.</li>
              <li>Laundry Connect is not liable for any indirect, incidental, or consequential damages arising from use of the platform.</li>
              <li>We do not guarantee uninterrupted or error-free operation of the platform, particularly in areas with limited internet connectivity.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">8. Intellectual Property</h2>
            <p>
              All content on the Laundry Connect platform, including the name, logo, design, and software,
              is the property of Laundry Connect and is protected under applicable intellectual property laws.
              You may not copy, modify, distribute, or create derivative works without our written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">9. Account Suspension and Termination</h2>
            <p>
              Laundry Connect reserves the right to suspend or terminate your account at our discretion if
              you violate these Terms, engage in fraudulent activity, or misuse the platform. You may also
              delete your account at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">10. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify users of material changes through
              the app or via SMS/email. Continued use of the platform after changes constitutes acceptance
              of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the United Republic
              of Tanzania. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction
              of the courts of Tanzania.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">12. Contact Information</h2>
            <p>
              If you have questions or concerns about these Terms, please contact us:
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
