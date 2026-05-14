import type { JobApplication } from '@/types/JobApplication'

const API_BASE_URL = 'http://localhost:5269/api/jobapplications'

export async function getAllJobApplications(): Promise<JobApplication[]> {
  const response = await fetch(API_BASE_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch job applications.')
  }

  return response.json()
}

export async function getJobApplicationById(id: number): Promise<JobApplication> {
  const response = await fetch(`${API_BASE_URL}/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch job application with id ${id}.`)
  }

  return response.json()
}

export async function createJobApplication(
  application: Omit<JobApplication, 'id' | 'createdAt'>,
): Promise<JobApplication> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  })

  if (!response.ok) {
    throw new Error('Failed to create job application.')
  }

  return response.json()
}

export async function updateJobApplication(id: number, application: JobApplication): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  })

  if (!response.ok) {
    throw new Error(`Failed to update job application with id ${id}.`)
  }
}

export async function deleteJobApplication(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete job application with id ${id}.`)
  }
}
