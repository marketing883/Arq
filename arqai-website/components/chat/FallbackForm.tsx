"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface FallbackFormProps {
  onSubmit: (data: { name: string; email: string; company?: string }) => void;
  onCancel: () => void;
}

export function FallbackForm({ onSubmit, onCancel }: FallbackFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--arq-gray-50)] rounded-xl p-4 border border-[var(--arq-gray-200)]"
    >
      <h4 className="font-semibold text-[var(--arq-black)] mb-2">
        Let us reach out to you
      </h4>
      <p className="text-sm text-[var(--arq-gray-600)] mb-4">
        We&apos;re experiencing some technical difficulties. Leave your details
        and we&apos;ll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Your name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 text-sm rounded-lg border ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-[var(--arq-gray-200)] focus:ring-[var(--arq-blue)]"
            } focus:outline-none focus:ring-2`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Work email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3 py-2 text-sm rounded-lg border ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-[var(--arq-gray-200)] focus:ring-[var(--arq-blue)]"
            } focus:outline-none focus:ring-2`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Company (optional)"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--arq-gray-200)] focus:outline-none focus:ring-2 focus:ring-[var(--arq-blue)]"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" size="sm" className="flex-1">
            Submit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
