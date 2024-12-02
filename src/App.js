import React from 'react';
import { Card } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import KasDuurzaamheidsDashboard from './components/KasDuurzaamheidsDashboard';
import VPDChart from './components/VPDChart';
import './index.css';

function App() {
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <Card className="max-w-7xl mx-auto">
        <Tabs defaultValue="energy">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="energy">Energie Dashboard</TabsTrigger>
            <TabsTrigger value="vpd">VPD Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="energy">
            <KasDuurzaamheidsDashboard />
          </TabsContent>
          
          <TabsContent value="vpd">
            <VPDChart />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

export default App;