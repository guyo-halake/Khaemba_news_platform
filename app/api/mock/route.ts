import { NextResponse } from 'next/server'
import {
  createArticle,
  updateArticle,
  deleteArticle,
  updateArticleStatus,
  addVideo,
  editVideo,
  deleteVideo,
  addCategory,
  editCategory,
  deleteCategory,
  addComment,
  updateCommentStatus,
  deleteComment,
  addAd,
  editAd,
  deleteAd,
  addAdClient,
  editAdClient,
  deleteAdClient,
  addAdPayment,
  editAdPayment,
  deleteAdPayment,
  addInquiry,
  updateInquiryStatus,
  deleteInquiry,
  addSubscriber
} from '@/lib/supabase/mockDb'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, id, data, status, email } = body

    switch (action) {
      case 'createArticle': {
        const art = await createArticle(data)
        return NextResponse.json(art)
      }
      case 'updateArticle': {
        await updateArticle(id, data)
        return NextResponse.json({ success: true })
      }
      case 'deleteArticle': {
        await deleteArticle(id)
        return NextResponse.json({ success: true })
      }
      case 'updateArticleStatus': {
        await updateArticleStatus(id, status)
        return NextResponse.json({ success: true })
      }
      case 'addVideo': {
        const vid = await addVideo(data)
        return NextResponse.json(vid)
      }
      case 'editVideo': {
        await editVideo(id, data)
        return NextResponse.json({ success: true })
      }
      case 'deleteVideo': {
        await deleteVideo(id)
        return NextResponse.json({ success: true })
      }
      case 'addCategory': {
        const cat = await addCategory(data)
        return NextResponse.json(cat)
      }
      case 'editCategory': {
        await editCategory(id, data)
        return NextResponse.json({ success: true })
      }
      case 'deleteCategory': {
        await deleteCategory(id)
        return NextResponse.json({ success: true })
      }
      case 'addComment': {
        const cmt = await addComment(data.articleId, data.authorName, data.body)
        return NextResponse.json(cmt)
      }
      case 'updateCommentStatus': {
        await updateCommentStatus(id, status)
        return NextResponse.json({ success: true })
      }
      case 'deleteComment': {
        await deleteComment(id)
        return NextResponse.json({ success: true })
      }
      case 'addAd': {
        const ad = await addAd(data)
        return NextResponse.json(ad)
      }
      case 'editAd': {
        await editAd(id, data)
        return NextResponse.json({ success: true })
      }
      case 'deleteAd': {
        await deleteAd(id)
        return NextResponse.json({ success: true })
      }
      case 'addAdClient': {
        const cli = await addAdClient(data)
        return NextResponse.json(cli)
      }
      case 'editAdClient': {
        await editAdClient(id, data)
        return NextResponse.json({ success: true })
      }
      case 'deleteAdClient': {
        await deleteAdClient(id)
        return NextResponse.json({ success: true })
      }
      case 'addAdPayment': {
        const pay = await addAdPayment(data)
        return NextResponse.json(pay)
      }
      case 'editAdPayment': {
        await editAdPayment(id, data)
        return NextResponse.json({ success: true })
      }
      case 'deleteAdPayment': {
        await deleteAdPayment(id)
        return NextResponse.json({ success: true })
      }
      case 'addInquiry': {
        const inq = await addInquiry(data)
        return NextResponse.json(inq)
      }
      case 'updateInquiryStatus': {
        await updateInquiryStatus(id, status)
        return NextResponse.json({ success: true })
      }
      case 'deleteInquiry': {
        await deleteInquiry(id)
        return NextResponse.json({ success: true })
      }
      case 'addSubscriber': {
        await addSubscriber(email)
        return NextResponse.json({ success: true })
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (err: any) {
    console.error('API mock handler error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
