'use server'

import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
)

export async function uploadDocumentToStorage(
  fileBase64: string, 
  fileName: string, 
  contentType: string,
  beneficiaryId: string,
  documentType: string
) {
  try {
    // Remove data URL prefix if present
    const base64Data = fileBase64.includes('base64,') 
      ? fileBase64.split('base64,')[1] 
      : fileBase64
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Upload file using admin privileges
    const { error: uploadError } = await supabaseAdmin.storage
      .from('beneficiary-documents')
      .upload(fileName, buffer, {
        contentType,
        upsert: true,
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }
    
    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('beneficiary-documents')
      .getPublicUrl(fileName)
    
    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL')
    }
    
    // Update beneficiary record
    const { error: updateError } = await supabaseAdmin
      .from('beneficiaries')
      .update({
        [`${documentType}_document_url`]: urlData.publicUrl
      })
      .eq('id', beneficiaryId)
    
    if (updateError) {
      console.error('Update error:', updateError)
      throw new Error(`Database update failed: ${updateError.message}`)
    }
    
    return { url: urlData.publicUrl }
  } catch (error) {
    console.error('Server upload error:', error)
    throw error
  }
}

export async function updateBeneficiaryDocument(
  beneficiaryId: string, 
  documentType: string, 
  url: string
) {
  try {
    const { error } = await supabaseAdmin
      .from('beneficiaries')
      .update({
        [`${documentType}_document_url`]: url
      })
      .eq('id', beneficiaryId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Update error:', error)
    throw error
  }
}