import { getSettings, updateSettings } from '@/app/actions';
import { Settings as SettingsIcon } from 'lucide-react';

export default async function AdminSettings() {
  const settings = await getSettings();

  const handleSaveSettings = async (formData: FormData) => {
    'use server';
    const deliveryFee = Number(formData.get('deliveryFee'));
    const freeDeliveryThreshold = Number(formData.get('freeDeliveryThreshold'));
    const isFreeDeliveryEnabled = formData.get('isFreeDeliveryEnabled') === 'on';

    await updateSettings({
      deliveryFee,
      freeDeliveryThreshold,
      isFreeDeliveryEnabled
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Settings</h1>
          <p className="text-stone-500 mt-1">Configure your store preferences.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <h2 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
          <SettingsIcon size={20} className="text-emerald-600" />
          Delivery Settings
        </h2>
        
        <form action={handleSaveSettings} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Flat Delivery Fee (₹)</label>
            <input
              type="number"
              name="deliveryFee"
              defaultValue={settings.deliveryFee}
              required
              min="0"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="pt-4 border-t border-stone-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-6 h-6 rounded border border-stone-300 bg-white group-hover:border-emerald-500 transition-colors">
                <input
                  type="checkbox"
                  name="isFreeDeliveryEnabled"
                  defaultChecked={settings.isFreeDeliveryEnabled}
                  className="peer sr-only"
                />
                <div className="absolute inset-0 bg-emerald-500 rounded border border-emerald-500 opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <span className="text-sm font-medium text-stone-900">Enable free delivery threshold</span>
            </label>
            
            <div className="mt-4 pl-9">
              <label className="block text-sm font-medium text-stone-700 mb-1">Free delivery for orders above (₹)</label>
              <input
                type="number"
                name="freeDeliveryThreshold"
                defaultValue={settings.freeDeliveryThreshold}
                min="0"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
