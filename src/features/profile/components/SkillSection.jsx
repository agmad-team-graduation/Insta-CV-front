import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui/card";
import { Button } from "@/common/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/common/components/ui/form";
import { Input } from "@/common/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";
import { PlusCircle, Pencil, Trash2, X, Check, Code } from "lucide-react";
import { cn } from "@/common/lib/utils";

const proficiencyLevels = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
];

const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Skill name is required"),
  level: z.string().min(1, "Level is required"),
});

function SkillsSection({ data, isEditMode, onUpdate }) {
  const [skills, setSkills] = useState(data);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [unsavedSkillIds, setUnsavedSkillIds] = useState([]);

  const form = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      level: "",
    },
  });

  // When data changes from parent (e.g., after save), clear unsaved highlights
  React.useEffect(() => {
    setSkills(data);
    setUnsavedSkillIds([]);
  }, [data]);

  const handleEdit = (skill) => {
    form.reset({
      name: skill.name,
      level: skill.level || ''
    });
    setEditingId(skill.id);
  };

  const handleAdd = () => {
    form.reset({
      name: "",
      level: "",
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    setSkills(updatedSkills);
    onUpdate(updatedSkills);
  };

  const onSubmit = (values) => {
    if (isAdding) {
      const newSkill = {
        ...values,
        id: Date.now().toString(),
      };
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      setUnsavedSkillIds(prev => [...prev, newSkill.id]);
      onUpdate(updatedSkills);
      setIsAdding(false);
    } else if (editingId) {
      const updatedSkills = skills.map(skill =>
        skill.id === editingId ? { ...values, id: skill.id } : skill
      );
      setSkills(updatedSkills);
      onUpdate(updatedSkills);
      setEditingId(null);
    }
  };

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Name</FormLabel>
                <FormControl>
                  <Input placeholder="JavaScript" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button type="submit" size="sm">
            <Check className="h-4 w-4 mr-2" /> Save
          </Button>
        </div>
      </form>
    </Form>
  );

  const getProficiencyClass = (proficiency) => {
    switch (proficiency) {
      case 'BEGINNER':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'INTERMEDIATE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ADVANCED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'EXPERT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-bold text-xl text-black text-left">Skills</CardTitle>
        <div className="flex items-center gap-2">
          {/* Skill Level Guide */}
          <div className="hidden md:flex items-center gap-2 mr-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-900 mr-1"></div>
              <span>Beginner</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900 mr-1"></div>
              <span>Intermediate</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-1"></div>
              <span>Advanced</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-1"></div>
              <span>Expert</span>
            </div>
          </div>
          {isEditMode && !isAdding && !editingId && (
            <Button variant="outline" size="sm" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Skill
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {skills.length === 0 && !isAdding ? (
          <div className="text-center py-4 text-muted-foreground">
            No skills added yet.
            {isEditMode && (
              <Button
                variant="link"
                className="ml-2"
                onClick={handleAdd}
              >
                Add one now
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <div
                key={skill.id || `${skill.name}-${skill.level}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                  getProficiencyClass(skill.level),
                  unsavedSkillIds.includes(skill.id) && "bg-yellow-100 border border-yellow-400",
                  editingId === skill.id && "ring-2 ring-primary",
                  isEditMode && "hover:opacity-80 transition-opacity cursor-default"
                )}
                onClick={() => isEditMode && handleEdit(skill)}
              >
                <Code className="h-3.5 w-3.5" />
                <span>{skill.name}</span>
                {isEditMode && (
                  <div className="flex items-center ml-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-transparent cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent's onClick
                        handleDelete(skill.id);
                      }}
                    >
                      <Trash2 className="h-2.5 w-2.5 text-muted-foreground hover:text-destructive transition-colors" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {(isAdding || editingId) && renderForm()}
      </CardContent>
    </Card>
  );
}

export default SkillsSection;