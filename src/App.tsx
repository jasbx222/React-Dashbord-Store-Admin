// App.tsx
import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import MainContent from "./MainContent";

function App() {
  return (
    <div dir="rtl" className="flex h-screen bg-[#fff] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main section: Header + Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {""}

        {/* Main content */}
        <main className="flex-1       w-full overflow-y-auto p-4 md:ml-72">
          <MainContent />
        </main>
      </div>
    </div>
  );
}

export default App;
