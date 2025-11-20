'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Calendar, 
  Heart, 
  Plus, 
  Search,
  Award,
  Target,
  Lightbulb,
  Clock
} from 'lucide-react'
import { DatabaseService } from '@/lib/db'
import { useAuthStore } from '@/stores/auth'

interface Project {
  id: string
  title: string
  description: string
  maxVolunteers: number
  currentVolunteers: number
  isFull: boolean
  isActive: boolean
  createdAt: string
  creator: {
    id: string
    name: string
    avatarUrl?: string
  }
  volunteers?: Array<{
    id: string
    user: {
      id: string
      name: string
      avatarUrl?: string
    }
    joinedAt: string
  }>
}

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [joiningProject, setJoiningProject] = useState<string | null>(null)
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    maxVolunteers: 10
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user) {
      alert('Please sign in to create a project')
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          maxVolunteers: newProject.maxVolunteers,
        }),
      })

      if (response.ok) {
        setNewProject({ title: '', description: '', maxVolunteers: 10 })
        setShowCreateDialog(false)
        fetchProjects()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project. Please try again.')
    }
  }

  const handleJoinProject = async (projectId: string) => {
    if (!isAuthenticated || !user) {
      alert('Please sign in to join a project')
      return
    }

    try {
      setJoiningProject(projectId)
      await DatabaseService.joinProject(projectId, user.id)
      fetchProjects()
    } catch (error) {
      console.error('Failed to join project:', error)
      alert('Failed to join project. Please try again.')
    } finally {
      setJoiningProject(null)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isUserInProject = (project: Project) => {
    return project.volunteers?.some(v => v.user.id === user?.id)
  }

  const isProjectFull = (project: Project) => {
    return (project.volunteers?.length || 0) >= project.maxVolunteers
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Community Projects
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Join forces with neighbors to make a difference in your community
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="h-12 px-8 text-lg bg-gradient-to-r from-primary to-primary/80">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Community Project</DialogTitle>
                    <DialogDescription>
                      Start a project to bring your community together
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Project Title *</label>
                      <Input
                        placeholder="e.g., Community Garden Cleanup"
                        value={newProject.title}
                        onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description *</label>
                      <Textarea
                        placeholder="Describe your project, goals, and what volunteers will do..."
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Maximum Volunteers: {newProject.maxVolunteers}
                      </label>
                      <Input
                        type="range"
                        min="2"
                        max="50"
                        value={newProject.maxVolunteers}
                        onChange={(e) => setNewProject(prev => ({ ...prev, maxVolunteers: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Create Project
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + (p.volunteers?.length || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Volunteers</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {projects.filter(p => isProjectFull(p)).length}
                </p>
                <p className="text-sm text-muted-foreground">Full Projects</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">+5</p>
                <p className="text-sm text-muted-foreground">Credits per Join</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded mb-4" />
                  <div className="h-8 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to create a community project!'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant={isProjectFull(project) ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {isProjectFull(project) ? 'Full' : 'Open'}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(project.createdAt)}
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </CardTitle>
                    
                    <CardDescription className="line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Creator Info */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {project.creator.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{project.creator.name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">Project Creator</p>
                      </div>
                    </div>

                    {/* Volunteers */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Volunteers</span>
                        <span className="font-medium">
                          {project.volunteers?.length || 0} / {project.maxVolunteers}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min(((project.volunteers?.length || 0) / project.maxVolunteers) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Recent Volunteers */}
                    {project.volunteers && project.volunteers.length > 0 && (
                      <div className="flex items-center gap-1">
                        {project.volunteers.slice(0, 3).map((volunteer) => (
                          <div
                            key={volunteer.id}
                            className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center"
                            title={volunteer.user.name}
                          >
                            <span className="text-xs font-medium">
                              {volunteer.user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        ))}
                        {project.volunteers.length > 3 && (
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">
                              +{project.volunteers.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      variant={isUserInProject(project) ? "outline" : "default"}
                      disabled={!isAuthenticated || isProjectFull(project) || isUserInProject(project)}
                      onClick={() => handleJoinProject(project.id)}
                    >
                      {joiningProject === project.id ? (
                        <>Joining...</>
                      ) : isUserInProject(project) ? (
                        <>Already Joined</>
                      ) : isProjectFull(project) ? (
                        <>Project Full</>
                      ) : !isAuthenticated ? (
                        <>Sign In to Join</>
                      ) : (
                        <>Join Project (+5 credits)</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}