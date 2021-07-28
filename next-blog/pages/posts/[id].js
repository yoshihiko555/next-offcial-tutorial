import Head from 'next/head'
import Layout from '../../components/layout'
import Date from '../../components/date'
import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXL}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}></div>
      </article>
    </Layout>
  )
}

export async function getStaticPaths () {
  const paths = getAllPostIds()
  return {
    // idとして取りうる値の配列は、returnされたオブジェクトのpathsキーに対応する値でなければならない
    paths,
    // fallback: falseであれば、getStaticPathsからreturnされていないあらゆるパスは404になる
    // 逆にtrueを設定した場合、pathsに指定されていないパスからのアクセスがあったとしても、404にならない
    // 代わりに以下のようなフローで新たに性的ファイルを生成し、クライアント側に返却する
    // 1. /posts/3のパスがRequestとしてくる
    // ※pathsに定義されていないidであるが、fallback: trueなので404ページは返却しない
    // 2. 裏側でサーバ側がgetStaticPropsを実行し、id=3に紐づく静的なファイルを生成する
    // 3. 生成が完了したら作成した静的ファイルを返す
    // 4. これ以降の/posts/3は②で作成した静的ファイルを返す。
    fallback: false
  }
}

export async function getStaticProps ({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}
