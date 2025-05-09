import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2, X, Check, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const proficiencyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Skill name is required"),
  proficiency: z.string().min(1, "Proficiency level is required"),
});

function SkillsSection({ data, isEditMode, onUpdate }) {
  const [skills, setSkills] = useState(data);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      proficiency: "",
    },
  });

  const handleEdit = (skill) => {
    form.reset(skill);
    setEditingId(skill.id);
  };

  const handleAdd = () => {
    form.reset({
      name: "",
      proficiency: "",
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
            name="proficiency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proficiency Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
      case 'amateur':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'expert':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'competent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'proficient':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Skills</CardTitle>
        <div className="flex items-center gap-2">
          {/* Skill Level Guide */}
          <div className="hidden md:flex items-center gap-2 mr-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-1"></div>
              <span>Amateur</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-1"></div>
              <span>Competent</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-900 mr-1"></div>
              <span>Proficient</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900 mr-1"></div>
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
                key={skill.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                  getProficiencyClass(skill.level),
                  editingId === skill.id && "ring-2 ring-primary"
                )}
              >
                <Code className="h-3.5 w-3.5" />
                <span>{skill.name}</span>
                {isEditMode && (
                  <div className="flex items-center ml-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 border-none"
                      onClick={() => handleEdit(skill)}
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 border-none"
                      onClick={() => handleDelete(skill.id)}
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
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