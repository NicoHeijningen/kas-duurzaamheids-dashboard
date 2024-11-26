import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sun, 
  Zap, 
  CloudSun,
  LeafyGreen,
  Factory
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const KasDuurzaamheidsDashboard = () => {
  const [energieBronnen, setEnergieBronnen] = useState([
    { 
      naam: 'Aardgas', 
      percentage: 40, 
      kleur: '#FF6B6B',
      icon: <Flame color="#FF6B6B" size={32} />,
      beschrijving: 'Traditionele energiebron voor kassen'
    },
    { 
      naam: 'Zonne-energie', 
      percentage: 20, 
      kleur: '#FFA726',
      icon: <Sun color="#FFA726" size={32} />,
      beschrijving: 'Zonnepanelen op kasdaken'
    },
    { 
      naam: 'Warmtekrachtkoppeling', 
      percentage: 15, 
      kleur: '#9C27B0',
      icon: <Factory color="#9C27B0" size={32} />,
      beschrijving: 'Gecombineerde warmte en elektriciteit'
    },
    { 
      naam: 'Geothermie', 
      percentage: 10, 
      kleur: '#2196F3',
      icon: <CloudSun color="#2196F3" size={32} />,
      beschrijving: 'Aardwarmte-energie'
    },
    { 
      naam: 'Waterstof', 
      percentage: 8, 
      kleur: '#00BCD4',
      icon: <LeafyGreen color="#00BCD4" size={32} />,
      beschrijving: 'Groene waterstofproductie'
    },
    { 
      naam: 'Elektriciteitsnet', 
      percentage: 7, 
      kleur: '#4CAF50',
      icon: <Zap color="#4CAF50" size={32} />,
      beschrijving: 'Energie van het nationale elektriciteitsnet'
    }
  ]);

  const [totalPercentage, setTotalPercentage] = useState(100);
  const [remainingPercentage, setRemainingPercentage] = useState(0);

  // Update remaining percentage when energy mix changes
  useEffect(() => {
    const currentTotal = energieBronnen.reduce((sum, bron) => sum + bron.percentage, 0);
    setRemainingPercentage(Math.max(0, 100 - currentTotal));
  }, [energieBronnen]);

  // Handle slider change for a specific energy source
  const handlePercentageChange = (naam, newPercentage) => {
    const updatedBronnen = energieBronnen.map(bron => 
      bron.naam === naam 
        ? { ...bron, percentage: newPercentage }
        : bron
    );

    setEnergieBronnen(updatedBronnen);
  };

  return (
    <div className="min-h-screen bg-green-50 p-8 flex flex-col items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-5xl">
        <div className="bg-green-600 text-white p-6 flex items-center">
          <LeafyGreen size={40} className="mr-4" />
          <h1 className="text-2xl font-bold">Duurzame Kas Energie Dashboard</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Energie Mix Visualisatie */}
          <div className="h-[400px]">
            <h2 className="text-xl font-semibold mb-4">Energiemix Samenstelling</h2>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={energieBronnen}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  dataKey="percentage"
                  label={({ naam, percentage }) => `${naam}: ${percentage}%`}
                >
                  {energieBronnen.map((bron, index) => (
                    <Cell key={`cell-${index}`} fill={bron.kleur} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-4 shadow-lg rounded-lg">
                          <h3 className="font-bold">{data.naam}</h3>
                          <p>{data.percentage}%</p>
                          <p className="text-sm text-gray-600">{data.beschrijving}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  formatter={(value) => {
                    const bron = energieBronnen.find(b => b.naam === value);
                    return bron ? `${value} (${bron.percentage}%)` : value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Energie Bronnen Details met Sliders */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Energie Bronnen Configuratie</h2>
            {energieBronnen.map((bron, index) => (
              <div 
                key={index} 
                className="bg-green-100 p-4 rounded-lg"
              >
                <div className="flex items-center mb-2">
                  <div className="mr-4">{bron.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-green-800">{bron.naam}</h3>
                    <p className="text-green-600 text-sm">{bron.beschrijving}</p>
                  </div>
                  <div className="text-green-900 font-semibold">
                    {bron.percentage}%
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={bron.percentage}
                    onChange={(e) => handlePercentageChange(bron.naam, Number(e.target.value))}
                    className="flex-grow"
                  />
                </div>
              </div>
            ))}
            
            <div className="text-sm mt-4">
              {remainingPercentage === 0 ? (
                <div className="text-green-600 font-semibold">
                  Energiemix volledig geconfigureerd ✓
                </div>
              ) : (
                <div className="text-red-600 font-semibold">
                  Nog {remainingPercentage}% beschikbaar om toe te wijzen
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KasDuurzaamheidsDashboard;