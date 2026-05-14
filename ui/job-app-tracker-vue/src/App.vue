<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import { getAllJobApplications, createJobApplication, updateJobApplication, deleteJobApplication } from '@/services/jobApplicationService'
import type { JobApplication } from '@/types/JobApplication'
import type { JobApplicationFormModel } from '@/types/JobApplicationForm'
import { ApplicationStatus } from '@/types/JobApplicationStatus'

const applications = ref<JobApplication[]>([])
const loading = ref(false)
const error = ref('')
const editingId = ref<number | null>(null)
const editingCreatedAt = ref<string | null>(null)
const searchTerm = ref('')
const selectedStatus = ref('')

const formInitialState: JobApplicationFormModel = {
  companyName: '',
  jobTitle: '',
  status: ApplicationStatus.Applied,
  dateApplied: new Date().toISOString().slice(0, 10),
  jobUrl: '',
  location: '',
  notes: '',
}

const formModel = ref<JobApplicationFormModel>({ ...formInitialState })
const statusOptions = Object.values(ApplicationStatus)

const filteredApplications = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  return applications.value.filter((app) => {
    const matchesSearch =
      !term ||
      app.companyName.toLowerCase().includes(term) ||
      app.jobTitle.toLowerCase().includes(term)
    const matchesStatus = !selectedStatus.value || app.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const loadApplications = async () => {
  try {
    loading.value = true
    error.value = ''
    applications.value = await getAllJobApplications()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load applications'
  } finally {
    loading.value = false
  }
}

const saveJobApplicationHandler = async () => {
  if (!formModel.value.companyName.trim() || !formModel.value.jobTitle.trim()) {
    error.value = 'Company and Job Title are required'
    return
  }

  try {
    loading.value = true
    error.value = ''

    if (editingId.value === null) {
      const newApplication = await createJobApplication(formModel.value)
      applications.value = [...applications.value, newApplication]
      resetForm()
      return
    }

    const updatedApplication: JobApplication = {
      id: editingId.value,
      createdAt: editingCreatedAt.value ?? new Date().toISOString(),
      ...formModel.value,
    }

    await updateJobApplication(editingId.value, updatedApplication)
    applications.value = applications.value.map((app) =>
      app.id === editingId.value ? updatedApplication : app,
    )
    resetForm()
  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : editingId.value === null
      ? 'Failed to create application'
      : 'Failed to update application'
  } finally {
    loading.value = false
  }
}

const editJobApplicationHandler = (application: JobApplication) => {
  editingId.value = application.id
  editingCreatedAt.value = application.createdAt
  formModel.value = {
    companyName: application.companyName,
    jobTitle: application.jobTitle,
    status: application.status,
    dateApplied: application.dateApplied,
    jobUrl: application.jobUrl ?? '',
    location: application.location ?? '',
    notes: application.notes ?? '',
  }
}

const cancelEditHandler = () => {
  resetForm()
}

const deleteJobApplicationHandler = async (id: number) => {
  try {
    loading.value = true
    error.value = ''
    await deleteJobApplication(id)
    applications.value = applications.value.filter((app) => app.id !== id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete application'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formModel.value = { ...formInitialState }
}

onMounted(() => {
  loadApplications()
})
</script>

<template>
  <div class="page-container">
    <h1>Job Application Tracker</h1>

    <div class="double-column">
      <!-- Form Section -->
      <section class="form-section">
        <h2>{{ editingId === null ? 'Add Application' : 'Edit Application' }}</h2>

        <div v-if="error" class="error">{{ error }}</div>

        <form @submit.prevent="saveJobApplicationHandler">
          <div>
            <input
              v-model="formModel.companyName"
              type="text"
              placeholder="Company"
              required
            />
          </div>

          <div>
            <input
              v-model="formModel.jobTitle"
              type="text"
              placeholder="Job Title"
              required
            />
          </div>

          <div>
            <select v-model="formModel.status">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>

          <div>
            <input
              v-model="formModel.dateApplied"
              type="date"
              required
            />
          </div>

          <div>
            <input
              v-model="formModel.jobUrl"
              type="url"
              placeholder="Job URL"
            />
          </div>

          <div>
            <input
              v-model="formModel.location"
              type="text"
              placeholder="Location"
            />
          </div>

          <div>
            <textarea
              v-model="formModel.notes"
              placeholder="Notes"
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              :disabled="loading"
              class="icon-btn"
              :title="editingId === null ? 'Add Application' : 'Save Changes'"
            >
              {{ editingId === null ? '➕' : '💾' }}
            </button>

            <button
              v-if="editingId !== null"
              type="button"
              @click="cancelEditHandler"
              :disabled="loading"
              class="delete-btn"
              title="Cancel"
            >
              ❌
            </button>
          </div>
        </form>
      </section>

      <!-- List Section -->
      <section class="list-section">
        <h2>My Applications</h2>

        <div class="filters">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search company or job title"
          />
          <select v-model="selectedStatus">
            <option value="">All statuses</option>
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>

        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="filteredApplications.length === 0" class="empty-state">
          No job applications found.
        </div>
        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Job Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in filteredApplications" :key="application.id">
                <td>{{ application.companyName }}</td>
                <td>{{ application.jobTitle }}</td>
                <td>
                  <span class="status-badge">{{ application.status }}</span>
                </td>
                <td>{{ new Date(application.dateApplied).toLocaleDateString() }}</td>
                <td>{{ application.location || '-' }}</td>
                <td>
                  <button
                    type="button"
                    class="icon-btn"
                    :disabled="loading"
                    @click="editJobApplicationHandler(application)"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="delete-btn"
                    :disabled="loading"
                    @click="deleteJobApplicationHandler(application.id)"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.double-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.form-section,
.list-section {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

form div {
  display: flex;
  flex-direction: column;
}

input,
select,
textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.icon-btn {
  font-size: 18px;
  padding: 10px;
  width: fit-content;
}

.form-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover:not(:disabled) {
  background-color: #b02a37;
}

.error {
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 10px;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #999;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.filters input,
.filters select {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

table th,
table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

table tbody tr:hover {
  background-color: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .double-column {
    grid-template-columns: 1fr;
  }
}
</style>
