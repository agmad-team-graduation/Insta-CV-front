import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const labelClass = "text-gray-500 font-semibold text-sm mb-1 text-left";
const valueClass = "text-black text-base text-left";

const PersonalDetailsSection = ({ name, email, phone, jobTitle, location, about, isEditMode, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name, email, phone, jobTitle, location, about });

  React.useEffect(() => {
    setForm({ name, email, phone, jobTitle, location, about });
  }, [name, email, phone, jobTitle, location, about]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-2xl text-black text-left">Personal Details</div>
        {isEditMode && !editing && (
          <Button variant="outline" className="ml-auto flex items-center gap-2" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </div>
      {editing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <div>
            <div className={labelClass}>Full Name</div>
            <input className="border rounded px-3 py-2 w-full" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <div className={labelClass}>Email</div>
            <input className="border rounded px-3 py-2 w-full" name="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <div className={labelClass}>Phone</div>
            <input className="border rounded px-3 py-2 w-full" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <div className={labelClass}>Job Title</div>
            <input className="border rounded px-3 py-2 w-full" name="jobTitle" value={form.jobTitle} onChange={handleChange} />
          </div>
          <div>
            <div className={labelClass}>Location</div>
            <input className="border rounded px-3 py-2 w-full" name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="md:col-span-2 mt-2">
            <div className={labelClass}>About</div>
            <textarea className="border rounded px-3 py-2 w-full" name="about" value={form.about} onChange={handleChange} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" type="button" onClick={() => setEditing(false)}>Cancel</button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" type="button" onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <div>
            <div className={labelClass}>Full Name</div>
            <div className={valueClass}>{name}</div>
          </div>
          <div>
            <div className={labelClass}>Email</div>
            <div className={valueClass}>{email}</div>
          </div>
          <div>
            <div className={labelClass}>Phone</div>
            <div className={valueClass}>{phone}</div>
          </div>
          <div>
            <div className={labelClass}>Job Title</div>
            <div className={valueClass}>{jobTitle}</div>
          </div>
          <div>
            <div className={labelClass}>Location</div>
            <div className={valueClass}>{location}</div>
          </div>
          <div className="md:col-span-2 mt-2">
            <div className={labelClass}>About</div>
            <div className={valueClass}>{about}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalDetailsSection; 