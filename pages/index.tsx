import Link from 'next/link';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import SvgArrowRight from '~/icons/arrow_right';
import { Container } from '~/components/Container';
import { TextCard } from '~/components/TextCard';
import { Product } from '~/components/Product';
import { useGetProducts } from '~/utils/apiRequests';
import { InferGetServerSidePropsType } from 'next';
import { getServerSidePropsNoLoginRequired as getServerSideProps } from '~/utils/getServerSideProps';
import { Main } from '~/components/Main';

// Does not require login
export { getServerSideProps };

export default function Shop({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Main>
      <NavBar user={user} />
      <MainInformation />
      <FeaturedProducts />
      <WhyChooseUs />
      <ContactInfo />
      <Footer />
    </Main>
  );
}

function MainInformation() {
  return (
    <div className="w-full bg-gray-50">
      <div className="mt-4 ml-4 flex h-96 min-w-48 flex-col justify-center bg-gray-50 sm:ml-[15%]">
        <p className="text-2xl font-bold wrap-anywhere sm:text-5xl">
          Modern Essentials for Everyday Living
        </p>
        <p className="max-w-lg text-lg text-gray-600">
          Discover our curated collection of minimalist products designed to
          enhance your lifestyle.
        </p>
        <Link
          href={'/products'}
          className="mt-5 flex h-11 w-max items-center rounded-full bg-gray-700 px-8 text-sm text-white hover:bg-gray-700/80"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const { data: products } = useGetProducts();

  return (
    <div>
      <div className="mt-12 ml-4 flex justify-between sm:ml-[15%]">
        <p className="text-2xl font-bold">Featured Products</p>
        <Link className="ml-4 flex items-center" href={'/products'}>
          View All
          <span className="ml-1">
            <SvgArrowRight className="w-6" />
          </span>
        </Link>
      </div>
      <div className="flex flex-wrap justify-center">
        {products?.map((product, index) => {
          return index >= 4 ? null : (
            <Product product={product} key={`product_${index}`} />
          );
        })}
      </div>
    </div>
  );
}

function WhyChooseUs() {
  return (
    <Container
      parentDivClassName="mt-15 flex justify-center"
      className="flex w-full flex-col flex-wrap items-center"
    >
      <div className="mt-5">
        <p className="text-xl font-bold">Why Choose MINIMONEY</p>
      </div>
      <div>
        <TextCard
          className="m-5 mt-7 rounded bg-white"
          parentDivClassName="w-full"
        >
          <p className="ml-3 font-bold">Quality Products</p>
          <p className="ml-3 text-gray-400">
            Carefully selected products that meet our high standards for quality
            and design.
          </p>
        </TextCard>
        <TextCard
          className="m-5 mt-7 rounded bg-white"
          parentDivClassName="w-full"
        >
          <p className="ml-3 font-bold">Fast Shipping</p>
          <p className="ml-3 text-gray-400">
            Free shipping on all orders over $50, with quick delivery to your
            doorstep.
          </p>
        </TextCard>
        <TextCard
          className="m-5 mt-7 rounded bg-white"
          parentDivClassName="w-full mb-5"
        >
          <p className="ml-3 font-bold">Quality Products</p>
          <p className="ml-3 text-gray-400">
            Carefully selected products that meet our high standards for quality
            and design.
          </p>
        </TextCard>
      </div>
    </Container>
  );
}

function ContactInfo() {
  return (
    <Container
      parentDivClassName="mt-8 justify-center flex"
      className="mr-3 w-96 sm:w-64"
    >
      <TextCard
        parentDivClassName="mt-5 w-full m-4 rounded sm:flex sm:justify-center"
        className="flex flex-col rounded"
      >
        <div className="wrap-anywhere">
          <p className="ml-4 font-bold">Contact</p>

          <div className="ml-4 text-sm">
            <p>support@minimoney.com</p>
            <p>+1 (555) 123-4567</p>
            <p>123 Not A Real Street, NY, USA</p>
          </div>
        </div>
      </TextCard>
    </Container>
  );
}
