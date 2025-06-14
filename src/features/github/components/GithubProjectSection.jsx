import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Github, ExternalLink, Send, FileCode2, X } from "lucide-react";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import apiClient from "@/common/utils/apiClient";
import { toast } from "sonner";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

const GithubProjectItem = ({ project, onAdd }) => {
  return (
    <Card className="mb-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
      <CardContent className="p-6">
        <div className="flex flex-row items-start gap-6">
          {/* Logo (same as ProjectSection) */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FileCode2 className="w-8 h-8 text-gray-700" />
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar: title left, buttons right */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xl text-black leading-tight text-left">
                  {project.name || "Untitled Project"}
                </h3>
              </div>
              <div className="flex gap-2">
                {project.htmlUrl && (
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    title="View on GitHub"
                  >
                    <a href={project.htmlUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  title="Add to profile"
                  onClick={() => onAdd(project)}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
            {/* Description */}
            {project.description && project.description.length > 1 && project.description.trim() ? (
              <p className="text-gray-700 text-base mb-4 whitespace-pre-line leading-relaxed text-left">
                {project.description}
              </p>
            ) : (
              <p className="text-gray-400 italic text-base mb-4 text-left">No description provided.</p>
            )}
            {/* Languages/Technologies */}
            {project.languages && project.languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {project.languages.map((language, idx) => {
                  const langName = typeof language === 'string' ? language : language.skill;
                  return (
                    <Badge key={idx} variant="secondary" className="text-xs px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200">
                      {langName}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const GithubProjectEditModal = ({ open, onClose, project, onSubmit }) => {
  // Only keep the required properties for the form
  const initialForm = project
    ? {
        title: project.name || project.title || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        description: project.description || '',
        skills: Array.isArray(project.languages)
          ? project.languages.map(l => ({ skill: typeof l === 'string' ? l : l.skill || l.name || '' }))
          : Array.isArray(project.skills)
            ? project.skills.map(s => ({ skill: typeof s === 'string' ? s : s.skill || s.name || '' }))
            : [],
        present: project.present || false,
      }
    : {
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        skills: [],
        present: false,
      };
  const [form, setForm] = React.useState(initialForm);
  const [error, setError] = React.useState("");

  // Always reset form when project changes or modal opens
  React.useEffect(() => {
    if (open && project) {
      const newForm = {
        title: project.name || project.title || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        description: project.description || '',
        skills: Array.isArray(project.languages)
          ? project.languages.map(l => ({ skill: typeof l === 'string' ? l : l.skill || l.name || '' }))
          : Array.isArray(project.skills)
            ? project.skills.map(s => ({ skill: typeof s === 'string' ? s : s.skill || s.name || '' }))
            : [],
        present: project.present || false,
      };
      setForm(newForm);
    }
  }, [open, project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSkillChange = (idx, value) => {
    const newSkills = [...form.skills];
    newSkills[idx] = { skill: value };
    setForm(prev => ({ ...prev, skills: newSkills }));
  };

  const handleAddSkill = () => {
    setForm(prev => ({ ...prev, skills: [...prev.skills, { skill: '' }] }));
  };

  const handleRemoveSkill = (idx) => {
    const newSkills = [...form.skills];
    newSkills.splice(idx, 1);
    setForm(prev => ({ ...prev, skills: newSkills }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validation
    const today = new Date();
    const start = form.startDate ? new Date(form.startDate + '-01') : null;
    const end = form.endDate ? new Date(form.endDate + '-01') : null;
    if (start && start > today) {
      setError("Start date must be before today.");
      return;
    }
    if (!form.present && start && end && end <= start) {
      setError("End date must be after start date.");
      return;
    }
    // Only send the required properties, and format dates as YYYY-MM-01
    const { title, startDate, endDate, description, skills, present } = form;
    const payload = {
      title,
      startDate: startDate ? startDate + '-01' : '',
      endDate: endDate && !present ? endDate + '-01' : '',
      description,
      skills,
      present,
    };
    await onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-2">Edit Project</h2>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="startDate"
              type="month"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="endDate"
              type="month"
              value={form.endDate}
              onChange={handleChange}
              disabled={form.present}
              required={!form.present}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          {form.skills.map((s, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                className="border rounded px-3 py-2 flex-1"
                value={s.skill}
                onChange={e => handleSkillChange(idx, e.target.value)}
              />
              <Button type="button" size="sm" variant="outline" onClick={() => handleRemoveSkill(idx)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" size="sm" variant="outline" onClick={handleAddSkill}>
            Add Skill
          </Button>
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
        <Button type="submit" className="w-full mt-4">
          Add to profile
        </Button>
      </form>
    </Modal>
  );
};

const GithubProjectSection = ({ projects }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAdd = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    try {
      const { skills, ...rest } = form;
      const payload = { ...rest, skills };
      await apiClient.put("/api/v1/profiles/add-project", payload);
      setModalOpen(false);
      setSelectedProject(null);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-bold text-xl text-black text-left flex items-center gap-2">
          <Github className="w-5 h-5" />
          GitHub Projects
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          {projects.length} {projects.length === 1 ? 'Repository' : 'Repositories'}
        </Badge>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Github className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p>No GitHub projects found.</p>
          </div>
        ) : (
          <div>
            {projects.map((project, index) => (
              <GithubProjectItem key={project.id || index} project={project} onAdd={handleAdd} />
            ))}
            <GithubProjectEditModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              project={selectedProject}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GithubProjectSection; 