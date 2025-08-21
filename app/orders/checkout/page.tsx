"use client";
import { useState } from "react";

export default function CheckoutPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        paymentType: "cash",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Order Submitted:", formData);
        // Send to API here...
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 space-y-4"
            >
                <div className="flex flex-row gap-5">
                    <div className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium">Address</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2 mt-1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    required
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2 mt-1"
                                />
                            </div>
                        </div>

                        {/* Payment Type */}
                        <div>
                            <label className="block text-sm font-medium">Payment Type</label>
                            <select
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1"
                            >
                                <option value="cash">Cash on Delivery</option>
                                <option value="card">Credit/Debit Card</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
                >
                    Place Order
                </button>
            </form>
        </div>
    );
}
