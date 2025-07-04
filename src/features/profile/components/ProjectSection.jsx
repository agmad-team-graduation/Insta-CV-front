import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Badge } from "@/common/components/ui/badge";
import { PlusCircle, FileCode2, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import DeleteTooltip from "../../resume-builder/components/DeleteTooltip";

const ProjectItem = ({ title, duration, present, description, skills, url }) => (
  
  <Card className="mb-4">
    <CardContent className="p-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon and main info */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {/* Circular icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FileCode2 className="w-8 h-8 text-gray-700" />
            </div>
          </div>
          {/* Main info */}
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg leading-tight mb-0.5">{title}</div>
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </a>
              )}
            </div>
            {description && <div className="text-black text-base mt-2">{description}</div>}
            {skills && skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="bg-gray-100 text-gray-800 rounded-lg px-3 py-1 text-base font-medium">
                    {skill.skill}
                  </span>
                ))}
              </div>
            )}
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

const initialForm = {
  title: "",
  startDate: "",
  endDate: "",
  description: "",
  url: "",
  present: false,
  skills: []
};

const ProjectSection = ({ projects, onAdd, onDelete, onEdit }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [abilityInput, setAbilityInput] = useState("");
  const [abilities, setAbilities] = useState([]);
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

  const handleAddAbility = (e) => {
    e.preventDefault();
    if (!abilityInput.trim()) return;
    setAbilities(prev => [...prev, { id: Date.now().toString(), skill: abilityInput.trim() }]);
    setAbilityInput("");
  };

  const handleRemoveAbility = (id) => {
    setAbilities(prev => prev.filter(a => a.id !== id));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title) return;
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError("End date must be after start date.");
      return;
    }
    const projectData = {
      title: form.title,
      startDate: form.startDate ? form.startDate + '-01' : '',
      endDate: form.endDate ? form.endDate + '-01' : '',
      description: form.description,
      present: form.present,
      skills: abilities
    };
    if (editingIndex !== null) {
      onEdit(editingIndex, projectData);
    } else {
      onAdd(projectData);
    }
    setForm(initialForm);
    setAbilities([]);
    setShowForm(false);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    onDelete(index);
  };

  const handleShowForm = () => {
    setShowForm(true);
    setEditingIndex(null);
    setForm(initialForm);
    setAbilities([]);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  };

  const handleEditClick = (index) => {
    const project = projects[index];
    setForm({
      title: project.title || "",
      startDate: project.startDate ? project.startDate.slice(0, 7) : "",
      endDate: project.endDate ? project.endDate.slice(0, 7) : "",
      description: project.description || "",
      url: project.url || "",
      present: !!project.present,
      skills: project.skills || []
    });
    setAbilities(project.skills || []);
    setShowForm(true);
    setEditingIndex(index);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-bold text-xl text-black text-left">Projects</CardTitle>
        <Button 
          onClick={handleShowForm}
          size="sm"
          variant="outline"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 && (
          <div className="text-center text-muted-foreground py-4">No projects added yet.</div>
        )}
        
        {/* Show add form when showForm is true and not editing */}
        {showForm && editingIndex === null && (
          <form ref={formRef} onSubmit={handleFormSubmit} className="mb-4 p-4 border rounded-lg bg-gray-50 flex flex-col gap-3">
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <input
              className="border rounded px-3 py-2"
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <div className="flex gap-3">
              <input
                className="border rounded px-3 py-2 flex-1"
                name="startDate"
                type="month"
                placeholder="Start Date (Optional)"
                value={form.startDate}
                onChange={handleChange}
              />
              <input
                className="border rounded px-3 py-2 flex-1"
                name="endDate"
                type="month"
                placeholder="End Date (Optional)"
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
            {/* Abilities/Skills input */}
            <div>
              <label className="block font-medium mb-1">Abilities / Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="border rounded px-3 py-2 flex-1"
                  placeholder="Add an ability (e.g. React, Node.js)"
                  value={abilityInput}
                  onChange={e => setAbilityInput(e.target.value)}
                />
                <Button type="button" size="sm" onClick={handleAddAbility}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {abilities.map(a => (
                  <span key={a.id} className="bg-gray-200 text-gray-800 rounded px-3 py-1 flex items-center gap-1">
                    {a.skill}
                    <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveAbility(a.id)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
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
              <Button type="button" variant="outline" size="sm" onClick={() => { setShowForm(false); setEditingIndex(null); setForm(initialForm); setAbilities([]); }}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Add
              </Button>
            </div>
          </form>
        )}
        
        {projects && projects.map((project, index) => (
          <div key={index} className="relative">
            {editingIndex === index ? (
              <form ref={formRef} onSubmit={handleFormSubmit} className="mb-4 p-4 border rounded-lg bg-gray-50 flex flex-col gap-3">
                {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
                <input
                  className="border rounded px-3 py-2"
                  name="title"
                  placeholder="Project Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                <div className="flex gap-3">
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    name="startDate"
                    type="month"
                    placeholder="Start Date (Optional)"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                  <input
                    className="border rounded px-3 py-2 flex-1"
                    name="endDate"
                    type="month"
                    placeholder="End Date (Optional)"
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
                {/* Abilities/Skills input */}
                <div>
                  <label className="block font-medium mb-1">Abilities / Skills</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      className="border rounded px-3 py-2 flex-1"
                      placeholder="Add an ability (e.g. React, Node.js)"
                      value={abilityInput}
                      onChange={e => setAbilityInput(e.target.value)}
                    />
                    <Button type="button" size="sm" onClick={handleAddAbility}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {abilities.map(a => (
                      <span key={a.id} className="bg-gray-200 text-gray-800 rounded px-3 py-1 flex items-center gap-1">
                        {a.skill}
                        <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveAbility(a.id)}>&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
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
                  <Button type="button" variant="outline" size="sm" onClick={() => { setShowForm(false); setEditingIndex(null); setForm(initialForm); setAbilities([]); }}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <ProjectItem {...project} />
                <button
                  className="absolute top-2 right-10 bg-white rounded-full p-1 shadow"
                  onClick={() => handleEditClick(index)}
                  title="Edit"
                  style={{ zIndex: 10 }}
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                </button>
                <div className="absolute top-2 right-2" style={{ zIndex: 10 }}>
                  <DeleteTooltip 
                    onDelete={() => handleDelete(index)} 
                    itemName={project.title}
                    className="bg-white rounded-full shadow"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectSection; 