"use client";


export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <div className="container mx-auto px-4 py-8">
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Zdravie v praxi. Všetky práva vyhradené.
            </p>
            <p className="text-xs text-gray-400 mt-4 md:mt-0 text-center md:text-right">
              Informácie na tejto stránke nenahradzujú odborné lekárske poradenstvo. 
              Pred začatím akéhokoľvek cvičebného programu alebo diéty sa poraďte 
              so svojim lekárom.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
