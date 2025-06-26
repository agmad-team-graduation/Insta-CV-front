import React, { useState, useRef } from "react";
import { Button } from "@/common/components/ui/button";
import { Edit, Plus, Briefcase, Trash2, PlusCircle } from "lucide-react";
import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";

const ExperienceItem = ({
  companyLogo,
  position,
  company,
  location,
  duration,
  months,
  description,
  present
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon and main info */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {/* Circular icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-gray-700" />
              </div>
            </div>
            {/* Main info */}
            <div className="min-w-0 text-left">
              <div className="font-semibold text-lg leading-tight mb-0.5">{position}</div>
              <div className="text-gray-500 text-base mb-1">{company}</div>
              {location && <div className="text-gray-700 text-base mb-1">{location}</div>}
              {description && <div className="text-black text-base mt-2">{description}</div>}
            </div>
          </div>
          {/* Right: Date range badge - only show if there are dates */}
          {duration?.displayText && (
            <div className="flex-shrink-0">
              <span className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-base font-medium">
                {duration.displayText}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const initialForm = {
  jobTitle: "",
  company: "",
  city: "",
  country: "",
  startDate: "",
  endDate: "",
  description: "",
  present: false
};

const ExperienceSection = ({ experiences, onAdd, onDelete, onEdit }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError("");
    if (!form.jobTitle || !form.company) return;
    const today = new Date().toISOString().slice(0, 7); // YYYY-MM
    if (form.startDate && form.startDate > today) {
      setError("Start date cannot be in the future.");
      return;
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate && !form.present) {
      setError("End date must be after start date.");
      return;
    }
    const newExperience = {
      jobTitle: form.jobTitle,
      company: form.company,
      city: form.city,
      country: form.country,
      startDate: form.startDate ? form.startDate + '-01' : '',
      endDate: form.present ? '' : (form.endDate ? form.endDate + '-01' : ''),
      description: form.description,
      present: !!form.present
    };
    onAdd(newExperience);
    setForm(initialForm);
    setShowForm(false);
  };

  const handleDelete = (index) => {
    onDelete(index);
  };

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setForm({
      jobTitle: experiences[index].position || "",
      company: experiences[index].company || "",
      city: experiences[index].city || "",
      country: experiences[index].country || "",
      startDate: experiences[index].startDate ? experiences[index].startDate.slice(0, 7) : "",
      endDate: experiences[index].endDate ? experiences[index].endDate.slice(0, 7) : "",
      description: experiences[index].description || "",
      present: !!experiences[index].present
    });
    setShowForm(false);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setError("");
    if (!form.jobTitle || !form.company) return;
    const today = new Date().toISOString().slice(0, 7);
    if (form.startDate && form.startDate > today) {
      setError("Start date cannot be in the future.");
      return;
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate && !form.present) {
      setError("End date must be after start date.");
      return;
    }
    const updatedExperience = {
      jobTitle: form.jobTitle,
      company: form.company,
      city: form.city,
      country: form.country,
      startDate: form.startDate ? form.startDate + '-01' : '',
      endDate: form.present ? '' : (form.endDate ? form.endDate + '-01' : ''),
      description: form.description,
      present: !!form.present
    };
    onEdit(editingIndex, updatedExperience);
    setEditingIndex(null);
    setForm(initialForm);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setForm(initialForm);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-bold text-xl text-black text-left">Work Experience</CardTitle>
        <Button 
          onClick={handleShowForm}
          size="sm"
          variant="outline"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </CardHeader>
      <CardContent>
        {experiences.length === 0 && (
          <div className="text-center text-muted-foreground py-4">No experience added yet.</div>
        )}
        {experiences && experiences.map((experience, index) => (
          <div key={index} className="relative">
            {editingIndex === index ? (
              <form ref={formRef} onSubmit={handleEditSave} className="mb-4 p-4 border rounded-lg bg-gray-50 flex flex-col gap-3">
                {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={form.jobTitle}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                  />
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    name="country"
                    placeholder="Country"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    name="startDate"
                    type="month"
                    placeholder="Start Date"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    name="endDate"
                    type="month"
                    placeholder="End Date"
                    value={form.endDate}
                    onChange={handleChange}
                    disabled={form.present}
                  />
                </div>
                <textarea
                  className="border rounded px-3 py-2"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="present"
                    checked={form.present}
                    onChange={handleChange}
                  />
                  Present
                </label>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={handleEditCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <ExperienceItem {...experience} />
                <button
                  className="absolute top-2 right-10 bg-white rounded-full p-1 shadow"
                  onClick={() => handleEditClick(index)}
                  title="Edit"
                  style={{ zIndex: 10 }}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                </button>
                <button
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow"
                  onClick={() => handleDelete(index)}
                  title="Delete"
                  style={{ zIndex: 10 }}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        ))}
        {showForm && (
          <form ref={formRef} onSubmit={handleAdd} className="mb-4 p-4 border rounded-lg bg-gray-50 flex flex-col gap-3">
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex flex-col md:flex-row gap-3">
              <input
                className="border rounded px-3 py-2 flex-1"
                name="jobTitle"
                placeholder="Job Title"
                value={form.jobTitle}
                onChange={handleChange}
                required
              />
              <input
                className="border rounded px-3 py-2 flex-1"
                name="company"
                placeholder="Company"
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                className="border rounded px-3 py-2 flex-1"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
              <input
                className="border rounded px-3 py-2 flex-1"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-3">
              <input
                className="border rounded px-3 py-2 flex-1"
                name="startDate"
                type="month"
                placeholder="Start Date"
                value={form.startDate}
                onChange={handleChange}
              />
              <input
                className="border rounded px-3 py-2 flex-1"
                name="endDate"
                type="month"
                placeholder="End Date"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
            <textarea
              className="border rounded px-3 py-2"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="present"
                checked={form.present}
                onChange={handleChange}
              />
              Present
            </label>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;