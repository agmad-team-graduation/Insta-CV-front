import { Button } from "@/common/components/ui/button";
import { CircleHelp } from 'lucide-react';
import { Card, CardHeader, CardContent } from "@/common/components/ui/card";
import { User, Package, LineChart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import IntegrationSection from "./components/IntegrationSection";

const LandingPage = () => {
    return ( 
        <div className="relative">
            {/* Modern gradient background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-gray-100 to-white" />

            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

            {/* Main content */}
            <div className="relative flex flex-col items-center justify-start pt-32 min-h-[85vh] text-center px-4">
                <div className="mb-12">
                    <img 
                        src="/logos/main-icon.png" 
                        alt="InstaCV Logo" 
                        className="w-24 h-24 bg-[#111827] rounded-3xl p-4"
                    />
                </div>

                <h1 className="text-6xl leading-tight font-medium text-[#111827] mb-6">
                    Click. Generate. Apply.
                    <br />
                    Powered by AI.
                </h1>

                <p className="text-gray-600 text-2xl mb-12">
                    Kickstart your path to smarter, AI-driven job success.
                </p>

                <div className="flex gap-6 mb-24">
                    <Link to="/signup">
                    <Button 
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-6 rounded-xl text-lg font-medium flex items-center h-16"
                    >
                        Get Started
                        <span className="ml-2 text-xl">→</span>
                    </Button>
                    </Link>
                    
                    <Button 
                        variant="secondary"
                        className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-8 py-6 rounded-xl text-lg font-medium flex items-center gap-3 h-16"
                    >
                        <CircleHelp />
                        Learn More
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/50 backdrop-blur-sm border border-gray-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Total User</div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">50,789</div>
                            <div className="flex items-center mt-2 space-x-1 text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full text-sm">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 2.5L9 6H3L6 2.5Z" fill="currentColor"/>
                                </svg>
                                <span>8.5% Up from yesterday</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/50 backdrop-blur-sm border border-gray-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Total Order</div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Package className="h-5 w-5 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">20393</div>
                            <div className="flex items-center mt-2 space-x-1 text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full text-sm">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 2.5L9 6H3L6 2.5Z" fill="currentColor"/>
                                </svg>
                                <span>1.3% Up from past week</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/50 backdrop-blur-sm border border-gray-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Total Sales</div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <LineChart className="h-5 w-5 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">$60,000</div>
                            <div className="flex items-center mt-2 space-x-1 text-red-600 bg-red-50 w-fit px-2 py-0.5 rounded-full text-sm">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9.5L9 6H3L6 9.5Z" fill="currentColor"/>
                                </svg>
                                <span>4.3% Down from yesterday</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white/50 backdrop-blur-sm border border-gray-100">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Total Pending</div>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Clock className="h-5 w-5 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">5040</div>
                            <div className="flex items-center mt-2 space-x-1 text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full text-sm">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 2.5L9 6H3L6 2.5Z" fill="currentColor"/>
                                </svg>
                                <span>1.8% Up from yesterday</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <IntegrationSection />
            </div>
        </div>
    );
}

export default LandingPage; 