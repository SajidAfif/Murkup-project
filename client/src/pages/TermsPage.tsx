export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          By using AmarToLet, you agree to use the platform responsibly and provide accurate information when posting or requesting properties.
        </p>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            1. Users must provide truthful property details and lawful contact information.
          </p>
          <p>
            2. Owners are responsible for the accuracy of the listings they publish.
          </p>
          <p>
            3. Fraudulent, misleading, or unsafe activity may result in account suspension.
          </p>
          <p>
            4. AmarToLet may update these terms at any time without prior notice.
          </p>
        </div>
      </div>
    </div>
  )
}
