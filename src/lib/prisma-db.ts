import { prisma } from '@/lib/prisma'

// Database helper functions for Prisma
export class PrismaDatabaseService {
  // User operations
  static async createUser(userData: {
    id?: string
    email: string
    password?: string
    name?: string
    credits?: number
    karma?: number
    isIdVerified?: boolean
  }) {
    const user = await prisma.user.create({
      data: userData
    })
    return user
  }

  static async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return user
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return user
  }

  static async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        karma: true,
        isIdVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return users
  }

  static async updateUser(id: string, userData: {
    email?: string
    name?: string
    credits?: number
    karma?: number
    isIdVerified?: boolean
  }) {
    const user = await prisma.user.update({
      where: { id },
      data: userData
    })
    return user
  }

  // Skill operations
  static async createSkill(skillData: {
    ownerId: string
    title: string
    description: string
    category: string
    priceCredits: number
    lat: number
    lng: number
    avgRating?: number
    isActive?: boolean
  }) {
    const skill = await prisma.skill.create({
      data: skillData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            karma: true,
            isIdVerified: true
          }
        }
      }
    })
    return skill
  }

  static async getSkills(filters?: {
    category?: string
    lat?: number
    lng?: number
    radius?: number
    limit?: number
  }) {
    const where: any = { isActive: true }
    
    if (filters?.category && filters.category !== 'all') {
      where.category = filters.category.toUpperCase()
    }

    const skills = await prisma.skill.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            karma: true,
            isIdVerified: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || undefined
    })

    return skills
  }

  static async getSkillById(id: string) {
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            karma: true,
            isIdVerified: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })
    return skill
  }

  static async updateSkill(id: string, skillData: {
    title?: string
    description?: string
    category?: string
    priceCredits?: number
    lat?: number
    lng?: number
    avgRating?: number
    isActive?: boolean
  }) {
    const skill = await prisma.skill.update({
      where: { id },
      data: skillData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            karma: true,
            isIdVerified: true
          }
        }
      }
    })
    return skill
  }

  // Booking operations
  static async createBooking(bookingData: {
    skillId: string
    learnerId: string
    startTime: Date
    endTime: Date
    status?: string
  }) {
    const booking = await prisma.booking.create({
      data: bookingData,
      include: {
        skill: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    })
    return booking
  }

  static async getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { learnerId: userId },
      include: {
        skill: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return bookings
  }

  static async updateBooking(id: string, bookingData: {
    status?: string
    startTime?: Date
    endTime?: Date
  }) {
    const booking = await prisma.booking.update({
      where: { id },
      data: bookingData,
      include: {
        skill: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    })
    return booking
  }

  // Review operations
  static async createReview(reviewData: {
    skillId: string
    reviewerId: string
    bookingId: string
    stars: number
    comment?: string
    isFlagged?: boolean
  }) {
    const review = await prisma.review.create({
      data: reviewData,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })
    return review
  }

  static async getSkillReviews(skillId: string) {
    const reviews = await prisma.review.findMany({
      where: { skillId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return reviews
  }

  // Credit transaction operations
  static async createCreditTransaction(txnData: {
    userId: string
    amount: number
    type: string
    refId?: string
    message?: string
  }) {
    const transaction = await prisma.creditTxn.create({
      data: txnData
    })
    return transaction
  }

  static async getUserCreditTransactions(userId: string) {
    const transactions = await prisma.creditTxn.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return transactions
  }

  // Community project operations
  static async createProject(projectData: {
    creatorId: string
    title: string
    description: string
    maxVolunteers: number
    currentVolunteers?: number
    isActive?: boolean
  }) {
    const project = await prisma.communityProject.create({
      data: projectData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        volunteers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    })
    return project
  }

  static async getProjects() {
    const projects = await prisma.communityProject.findMany({
      where: { isActive: true },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        volunteers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return projects
  }

  static async joinProject(projectId: string, userId: string) {
    const volunteer = await prisma.projectVolunteer.create({
      data: {
        projectId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })
    return volunteer
  }
}

// Export the database service as default
export default PrismaDatabaseService