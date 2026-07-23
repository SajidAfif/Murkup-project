export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We collect the minimum information required to provide the rental marketplace experience securely.
        </p>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            1. We use your email, phone number, and verification details only for account and property management.
          </p>
          <p>
            2. Your password is stored securely through hashing.
          </p>
          <p>
            3. Verification documents are used only to confirm owner identity and are not shared publicly.
          </p>
          <p>
            4. You can contact support to request changes to your saved information.
          </p>
        </div>
      </div>
    </div>
  )
}
