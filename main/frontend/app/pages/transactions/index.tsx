const TransactionPage: React.FC = () => {
  return (
    <div>
      <h1>Transactions</h1>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      requiresAuth: true,
    },
  }
}

export default TransactionPage
