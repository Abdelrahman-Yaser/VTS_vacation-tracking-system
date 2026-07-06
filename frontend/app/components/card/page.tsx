"use client";
import { useState } from 'react';

// قائمة افتراضية للألوان المتوفرة للمنتج
const productColors = [
  { name: 'Cream', hex: '#F3F2EE' },
  { name: 'Light Blue', hex: '#A8C9E2' },
  { name: 'Navy', hex: '#0A335E' },
  { name: 'Gray', hex: '#D1D5DB' },
];

const ColorSelector = () => {
  // الحالة لتخزين اللون المختار حاليًا، نبدأ باللون الأول افتراضيًا
  const [selectedColor, setSelectedColor] = useState(productColors[0].name);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Color: <span className="font-normal">{selectedColor}</span>
      </h3>
      
      <div className="flex space-x-3">
        {productColors.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.name)}
            aria-label={`Select ${color.name} color`}
            // الحاوية الخارجية للزر لتطبيق تأثير التحديد
            className={`
              w-10 h-10 rounded-full flex items-center justify-center 
              border-2 transition-all duration-200
              ${selectedColor === color.name 
                ? 'border-blue-600 dark:border-blue-400 p-0.5' // نمط التحديد (يظهر إطار أزرق حول الدائرة)
                : 'border-transparent hover:border-gray-300' // نمط غير محدد
              }
            `}
          >
            {/* الدائرة الملونة الفعلية */}
            <div 
              className="w-full h-full rounded-full shadow-md" 
              style={{ backgroundColor: color.hex, border: '1px solid rgba(0,0,0,0.1)' }} 
            ></div>
          </button>
        ))}
      </div>
      
      {/* يمكن هنا تمرير اللون المختار إلى المكون الأب (parent component) */}
      <input type="hidden" name="color" value={selectedColor} />
    </div>
  );
};

export default ColorSelector;