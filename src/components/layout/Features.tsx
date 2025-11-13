import { Calendar, CreditCard, Mail } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Flexible Classes',
    description: 'Choose from hundreds of classes across yoga, HIIT, strength training, and more. Book at your convenience.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Safe and encrypted payment processing. Multiple payment options with instant confirmation.',
  },
  {
    icon: Mail,
    title: 'Instant Confirmation',
    description: 'Receive booking confirmations instantly via email and SMS. Never miss your workout.',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose GymFlow?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your fitness journey in one place
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
