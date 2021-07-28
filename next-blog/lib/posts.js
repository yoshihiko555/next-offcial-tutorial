import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remart from 'remark'
import html from 'remark-html'
import remark from 'remark'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // /posts配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // idを取得する為にファイル名から'.md'を削除する
    const id = fileName.replace(/\.md$/, '')
    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    // 投稿のメタデータ部分を解析するためにgray-matterを使う
    const matterResult = matter(fileContents)
    // データとidと合わせる
    return {
      id,
      ...matterResult.data
    }
  })
  // 投稿を日付でソートする
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1
    else return -1
  })
}

export function getAllPostIds () {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    // returnされるリストはただの文字列の配列ではなく、オブジェクトの配列でなければならない
    // 各オブジェクトにはparamsキーが存在していて、idキーを持ったオブジェクトを含んでいなくてはならない(ファイル名で[id]を使用するため)
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData (id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHtml = processedContent.toString()
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}
