import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '~/components/Footer';
import { NavBar } from '~/components/NavBar';
import SvgArrowRight from '~/icons/arrow_right';
import SvgStoreBag from '~/icons/store_bag';
import { Container } from '../../components/Container';
import { TextCard } from '~/components/TextCard';
import { toast } from 'react-toastify';
import { arrayOfProducts } from '~/utils/debug';

export default function Shop() {
  return (
    <main className="h-screen w-full bg-white">
      <div className="w-full">
        <NavBar />
      </div>
      <MainInformation />
      <FeaturedProducts />
      <WhyChooseUs />
      <ContactInfo />
      <Footer />
    </main>
  );
}

function MainInformation() {
  return (
    <div className="w-full bg-gray-50">
      <div className="ml-4 flex h-96 min-w-48 flex-col justify-center bg-gray-50 sm:ml-[15%]">
        <p className="text-2xl font-bold wrap-anywhere sm:text-5xl">
          Modern Essentials for Everyday Living
        </p>
        <p className="max-w-lg text-lg text-gray-600">
          Discover our curated collection of minimalist products designed to
          enhance your lifestyle.
        </p>
        <Link
          href={'/shop/products'}
          className="mt-5 flex h-11 w-max items-center rounded-full bg-gray-700 px-8 text-sm text-white hover:bg-gray-700/80"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}

function FeaturedProducts() {
  return (
    <div>
      <div className="mt-12 ml-4 flex sm:ml-[15%]">
        <p className="text-2xl font-bold">Featured Products</p>
        <button className="ml-4 flex items-center">
          View All
          <span className="ml-1">
            <SvgArrowRight className="w-6" />
          </span>
        </button>
      </div>
      <div className="flex flex-wrap justify-center">
        {arrayOfProducts.map((product, index) => (
          <FeatureProduct
            image={product.image}
            price={product.price}
            title={product.title}
            key={`product_${index}`}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureProduct({
  image,
  price,
  title,
}: {
  price: string;
  image: string;
  title: string;
}) {
  return (
    <div className="mt-8 flex justify-center">
      <div className="m-3 mr-5 ml-5 flex flex-col items-center rounded border border-gray-100 bg-gray-100">
        <div className="m-5">
          <Image
            alt="SSD"
            src={image}
            width={1920}
            height={1080}
            className="w-48 rounded-md"
          />
        </div>
        <div className="w-full bg-white">
          <div className="m-3 mr-5 ml-5 flex flex-col items-center text-sm text-gray-500">
            <p className="flex items-center">
              {title}
              <span className="ml-3">
                <button
                  onClick={() => {
                    toast('Test', {
                      theme: 'light',
                    });
                  }}
                >
                  <SvgStoreBag className="w-6" />
                </button>
              </span>
            </p>
            <p>{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhyChooseUs() {
  return (
    <Container
      parentDivClassName="mt-15 flex justify-center"
      className="flex w-max flex-col flex-wrap items-center"
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
    <Container className="mr-3" parentDivClassName="mt-8">
      <TextCard
        parentDivClassName="mt-5 w-full m-4 rounded"
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
