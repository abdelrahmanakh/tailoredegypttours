'use client'
import { useState } from 'react'
import BasicInfoTab from './tabs/BasicInfoTab'
import ImagesTab from './tabs/ImagesTab'
import ItineraryTab from './tabs/ItineraryTab'
import LocationTab from './tabs/LocationTab'
import ExtrasTab from './tabs/ExtrasTab'
import FaqTab from './tabs/FaqTab'
import SchedulesTab from './tabs/SchedulesTab'
import AudioGuidesTab from './tabs/AudioGuidesTab'

export default function TourEditor({ tour, destinations, categories, languages, tags, updateSharedAction, saveTransAction }) {
  const [activeTab, setActiveTab] = useState('basic')

  const tabs = [
    { id: 'basic', label: 'Basic & Content', icon: 'fa-file-lines' },
    { id: 'images', label: 'Gallery', icon: 'fa-images' },
    { id: 'itinerary', label: 'Itinerary', icon: 'fa-list-ol' },
    { id: 'location', label: 'Map / Location', icon: 'fa-map-location-dot' },
    { id: 'extras', label: 'Extras', icon: 'fa-gift' },
    { id: 'audio', label: 'Audio Guides', icon: 'fa-headphones' },
    { id: 'faq', label: 'FAQ', icon: 'fa-circle-question' },
    { id: 'schedules', label: 'Schedule', icon: 'fa-calendar-days' },
  ]

  return (
    <div className="space-y-6">
      
      {/* HORIZONTAL TABS NAVIGATION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden z-10">
        <div className="flex overflow-x-auto no-scrollbar"> 
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-4 
                ${activeTab === tab.id 
                  ? 'border-primary text-primary bg-emerald-50/50' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div>
        {activeTab === 'basic' && (
          <BasicInfoTab 
            tour={tour} 
            destinations={destinations} 
            categories={categories}
            languages={languages}
            tags={tags}
            updateSharedAction={updateSharedAction}
            saveTransAction={saveTransAction}
          />
        )}
        {activeTab === 'images' && (
          <ImagesTab 
            tour={tour}
            languages={languages}
          /> 
        )}
        {activeTab === 'itinerary' && (
          <ItineraryTab tour={tour} languages={languages} />
        )}
        {activeTab === 'location' && (
          <LocationTab tour={tour} />
        )}
        {activeTab === 'extras' && (
          <ExtrasTab tour={tour} languages={languages} />
        )}
        {activeTab === 'audio' && (
          <AudioGuidesTab tour={tour} languages={languages} />
        )}
        {activeTab === 'faq' && (
          <FaqTab tour={tour} languages={languages} />
        )}
        {activeTab === 'schedules' && (
          <SchedulesTab tour={tour} />
        )}
      </div>
    </div>
  )
}